const fs = require("fs");
const path = require("path");
const os = require("os");

const DEFAULT_CONFIG = {
  enginePath: "",
  port: 3080,
  api: { model: "deepseek-v4-flash", keyEnv: "DEEPSEEK_API_KEY" },
  local: {
    ollamaUrl: "http://localhost:11434",
    models: ["qwen3.5:9b", "minicpm-v4.6", "nomic-embed-text"]
  },
  om: {
    url: "http://localhost:8080",
    apiKey: ""
  },
  mounts: {
    skills: "",
    instructions: "",
    deploy: "",
    knowledge: "",
    thinking: "",
    memory: "",
    cases: "",
    engines: "",
    mcp: "",
    aiModel: "",
    comfyui: "",
    projects: "",
    designAssets: "",
    pending: "",
    roleLibrary: "",
    designGate: "",
    researchReports: "",
    tasteSystem: "",
    memoryFlash: "",
    sessionMemory: "",
    kgCrystal: "",
    engineMiao: "",
    contentOut: "",
    obsidian: ""
  },
  autoStart: false,
  hotkey: "Ctrl+Alt+D",
  theme: "light",
  userName: "海龙龙",
  lang: "zh",
  skin: "default-light",
  logPath: path.join(os.homedir(), "AppData", "Roaming", "dsh-desktop", "logs")
};

class Config {
  constructor() {
    this.dir = path.join(os.homedir(), "AppData", "Roaming", "dsh-desktop");
    this.file = path.join(this.dir, "config.json");
    this.data = this.load();
  }

  load() {
    try {
      if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir, { recursive: true });
      if (!fs.existsSync(this.file)) {
        fs.writeFileSync(this.file, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf8");
        return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      }
      const raw = JSON.parse(fs.readFileSync(this.file, "utf8"));
      return this.mergeDeep(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), raw);
    } catch (e) {
      console.error("[config] load failed:", e.message);
      return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }
  }

  mergeDeep(base, extra) {
    if (typeof base !== "object" || base === null) return extra;
    if (typeof extra !== "object" || extra === null) return base;
    for (const k of Object.keys(extra)) {
      if (typeof extra[k] === "object" && extra[k] !== null && !Array.isArray(extra[k]) && typeof base[k] === "object" && base[k] !== null) {
        base[k] = this.mergeDeep(base[k], extra[k]);
      } else {
        base[k] = extra[k];
      }
    }
    return base;
  }

  get() {
    return this.data;
  }

  set(patch) {
    this.data = { ...this.data, ...patch };
    this.save();
    return this.data;
  }

  setMount(key, value) {
    if (!this.data.mounts) this.data.mounts = {};
    this.data.mounts[key] = value;
    this.save();
    return this.data.mounts;
  }

  save() {
    try {
      fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2), "utf8");
    } catch (e) {
      console.error("[config] save failed:", e.message);
    }
  }
}

module.exports = new Config();