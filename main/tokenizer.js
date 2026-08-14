const { spawn } = require("child_process");

const PY = "F:\\00-engines\\DEV-python\\3.12\\python.exe";
const SCRIPT = "F:\\00-engines\\DEV-deepseek-tokenizer\\deepseek_token_counter.py";

class TokenCounter {
  constructor() {
    this.proc = null;
    this.pending = new Map();
    this.seq = 0;
    this.ready = false;
  }

  ensure() {
    if (this.proc) return;
    this.proc = spawn(PY, ["-u", SCRIPT, "--json"], { stdio: ["pipe", "pipe", "pipe"] });
    this.proc.stdin.on("error", () => {});
    this.proc.stdout.setEncoding("utf8");
    let buf = "";
    this.proc.stdout.on("data", (chunk) => {
      buf += chunk;
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          if (obj.id && this.pending.has(obj.id)) {
            const { resolve, reject } = this.pending.get(obj.id);
            this.pending.delete(obj.id);
            if (obj.error) reject(new Error(obj.error));
            else resolve(obj.tokens);
          }
        } catch (e) {}
      }
    });
    this.proc.stderr.on("data", (d) => {
      if (this._log) console.error("[tokenizer] stderr:", d.toString().slice(0, 200));
    });
    this.proc.on("error", (e) => {
      console.error("[tokenizer] spawn error:", e.message);
      this.proc = null;
    });
    this.proc.on("exit", () => {
      this.proc = null;
      for (const [, p] of this.pending) p.reject(new Error("tokenizer exited"));
      this.pending.clear();
    });
    this.ready = true;
  }

  count(text) {
    return new Promise((resolve, reject) => {
      try {
        this.ensure();
        if (!this.proc) return reject(new Error("no proc"));
        const id = "t" + ++this.seq;
        this.pending.set(id, { resolve, reject });
        const payload = JSON.stringify({ id, text: String(text || "") });
        const ok = this.proc.stdin.write(payload + "\n");
        if (!ok) {
          this.proc.stdin.once("drain", () => {});
        }
        setTimeout(() => {
          if (this.pending.has(id)) {
            this.pending.delete(id);
            reject(new Error("tokenizer timeout"));
          }
        }, 15000);
      } catch (e) {
        reject(e);
      }
    });
  }

  stop() {
    if (this.proc) {
      try { this.proc.kill(); } catch (e) {}
      this.proc = null;
    }
  }
}

module.exports = new TokenCounter();