const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("http");
const config = require("./config");

class Backend {
  constructor() {
    this.child = null;
    this.state = "stopped"; // stopped | starting | running | stopping | crashed
    this.restartCount = 0;
    this.restartWindowStart = 0;
    this.listeners = [];
    this.logStream = null;
  }

  onStateChange(fn) {
    this.listeners.push(fn);
  }

  emit() {
    for (const fn of this.listeners) fn(this.state);
  }

  setState(s) {
    this.state = s;
    this.emit();
  }

  ensureLogStream() {
    if (this.logStream) return this.logStream;
    const logDir = config.get().logPath;
    try {
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
      const file = path.join(logDir, `backend-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.log`);
      this.logStream = fs.createWriteStream(file, { flags: "a" });
      return this.logStream;
    } catch (e) {
      console.error("[backend] log stream fail:", e.message);
      return null;
    }
  }

  engineExists() {
    const p = config.get().enginePath;
    return fs.existsSync(path.join(p, "package.json"));
  }

  start() {
    if (this.state === "running" || this.state === "starting") return;
    if (!this.engineExists()) {
      this.setError("engine missing");
      return;
    }
    this.setState("starting");
    const cfg = config.get();
    const stream = this.ensureLogStream();

    const args = ["dsh", "web"];
    const child = spawn("pnpm", args, {
      cwd: cfg.enginePath,
      shell: true,
      env: { ...process.env }
    });

    this.child = child;

    const handle = (chunk) => {
      const line = chunk.toString();
      if (stream) stream.write(line);
    };
    child.stdout.on("data", handle);
    child.stderr.on("data", handle);

    child.on("error", (err) => {
      console.error("[backend] spawn error:", err.message);
      this.setError("spawn failed");
    });

    child.on("exit", (code) => {
      console.log("[backend] exited:", code);
      if (this.state === "starting" || this.state === "running") {
        this.handleCrash(code);
      } else {
        this.setState("stopped");
      }
    });

    this.waitHealthy(() => this.setState("running"));
  }

  setError(msg) {
    this.errorMsg = msg;
    this.setState("crashed");
  }

  waitHealthy(done) {
    const port = config.get().port;
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      this.ping(port)
        .then((ok) => {
          if (ok) {
            clearInterval(timer);
            done();
          } else if (tries >= 15) {
            clearInterval(timer);
            console.log("[backend] health timeout");
            this.setState("crashed");
          }
        })
        .catch(() => {
          if (tries >= 15) {
            clearInterval(timer);
            this.setState("crashed");
          }
        });
    }, 1000);
  }

  ping(port) {
    return new Promise((resolve) => {
      const req = http.get(`http://127.0.0.1:${port}`, { timeout: 2000 }, (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      });
      req.on("error", () => resolve(false));
      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  handleCrash() {
    const now = Date.now();
    if (now - this.restartWindowStart > 10 * 60 * 1000) {
      this.restartWindowStart = now;
      this.restartCount = 0;
    }
    if (this.restartCount >= 3) {
      this.setState("crashed");
      return;
    }
    this.restartCount++;
    console.log(`[backend] restart #${this.restartCount}`);
    setTimeout(() => this.start(), 2000);
  }

  stop() {
    if (!this.child) return;
    this.setState("stopping");
    const child = this.child;
    this.child = null;
    if (process.platform === "win32") {
      exec(`taskkill /PID ${child.pid} /T`, () => {
        setTimeout(() => {
          try { exec(`taskkill /PID ${child.pid} /T /F`, () => {}); } catch (e) {}
        }, 3000);
      });
    } else {
      try {
        child.kill("SIGTERM");
        setTimeout(() => { try { child.kill("SIGKILL"); } catch (e) {} }, 3000);
      } catch (e) {}
    }
    setTimeout(() => this.setState("stopped"), 500);
  }

  restart() {
    this.stop();
    setTimeout(() => this.start(), 1500);
  }

  getState() {
    return { state: this.state, errorMsg: this.errorMsg, restartCount: this.restartCount };
  }
}

module.exports = new Backend();