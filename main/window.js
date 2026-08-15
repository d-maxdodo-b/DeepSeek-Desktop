const { BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const config = require("./config");
const backend = require("./backend");
const tokenizer = require("./tokenizer");

const ICON_PATH = path.join(__dirname, "..", "build", "icons", "dsh-icon.ico");
const SHELL_HTML = path.join(__dirname, "..", "renderer", "index.html");

/** 渲染进程错误日志(白屏诊断): %APPDATA%/dsh-desktop/logs/renderer-error.log */
function logRendererError(msg) {
  try {
    const logDir = path.join(config.get().logPath || path.join(require("os").homedir(), "AppData", "Roaming", "dsh-desktop", "logs"));
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    const file = path.join(logDir, "renderer-error.log");
    fs.appendFileSync(file, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) { /* ignore */ }
}

function attachRendererDiagnostics(win, label) {
  if (!win || win.isDestroyed()) return;
  win.webContents.on("console-message", (e, level, message, line, sourceId) => {
    if (level >= 2) logRendererError(`[${label}] console(${level}) ${sourceId}:${line} ${message}`);
  });
  win.webContents.on("render-process-gone", (e, details) => {
    logRendererError(`[${label}] render-process-gone reason=${details.reason} exitCode=${details.exitCode}`);
  });
  win.webContents.on("did-fail-load", (e, code, desc) => {
    logRendererError(`[${label}] did-fail-load code=${code} desc=${desc}`);
  });
  win.webContents.on("preload-error", (e, path, error) => {
    logRendererError(`[${label}] preload-error ${path} ${error && error.message}`);
  });
}

let mainWindow = null;
let shellWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    icon: ICON_PATH,
    backgroundColor: "#f5f6f8",
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "main-win.preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  loadWebUi();
  attachRendererDiagnostics(mainWindow, "main");

  mainWindow.on("page-title-updated", (e) => {
    e.preventDefault();
    const user = config.get().userName || "海龙龙";
    const h = new Date().getHours();
    let g = "你好";
    if (h >= 5 && h < 9) g = "早上好";
    else if (h >= 9 && h < 12) g = "上午好";
    else if (h >= 12 && h < 14) g = "中午好";
    else if (h >= 14 && h < 18) g = "下午好";
    else if (h >= 18 && h < 23) g = "晚上好";
    else g = "夜深了";
    mainWindow.setTitle(`DeepSeek Harness ${g}，${user}`);
  });
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("did-fail-load", (e, code, desc) => {
    console.error("[main] load fail:", code, desc);
  });
  mainWindow.on("maximize", () => { if (!mainWindow.isDestroyed()) mainWindow.webContents.send("ui:win-maximized", true); });
  mainWindow.on("unmaximize", () => { if (!mainWindow.isDestroyed()) mainWindow.webContents.send("ui:win-maximized", false); });
  mainWindow.on("closed", () => { mainWindow = null; });

  return mainWindow;
}

function loadWebUi() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const url = `http://127.0.0.1:${config.get().port}`;
  mainWindow.loadURL(url).catch(() => {
    mainWindow.loadFile(path.join(__dirname, "..", "renderer", "loading.html"));
  });
  mainWindow.webContents.once("did-finish-load", () => {
    try {
      const fs = require("fs");
      const root = path.join(__dirname, "..", "renderer");
      const langCode = fs.readFileSync(path.join(root, "lang-packs.js"), "utf8");
      const skinsCode = fs.readFileSync(path.join(root, "skins.js"), "utf8");
      const injectCode = fs.readFileSync(path.join(root, "ui-inject.js"), "utf8");
      const wordmarkSvg = fs.readFileSync(path.join(root, "..", "build", "icons", "dsh-brand-text.svg"), "utf8").replace(/\s+/g, " ").trim();
      const whaleSvg = fs.readFileSync(path.join(root, "..", "build", "icons", "dsh-brand-icon.svg"), "utf8").replace(/\s+/g, " ").trim();
      const cfg = config.get();
      const lang = cfg.lang || "zh";
      const skin = cfg.skin || "default-light";
      const userName = cfg.userName || "海龙龙";
      mainWindow.webContents.executeJavaScript(langCode).then(() => {
        return mainWindow.webContents.executeJavaScript(skinsCode);
      }).then(() => {
        const code = injectCode
          .replace("window.__dshLang__ = null", `window.__dshLang__ = ${JSON.stringify(lang)}`)
          .replace("window.__dshSkinId__ = null", `window.__dshSkinId__ = ${JSON.stringify(skin)}`)
          .replace("window.__dshWordmarkSvg__ = null", `window.__dshWordmarkSvg__ = ${JSON.stringify(wordmarkSvg)}`)
          .replace("window.__dshWhaleSvg__ = null", `window.__dshWhaleSvg__ = ${JSON.stringify(whaleSvg)}`)
          .replace("const nameHint = (window.__dshUserName__) || \"海龙龙\";", `const nameHint = ${JSON.stringify(userName)};`);
        return mainWindow.webContents.executeJavaScript(code);
      }).catch((e) => {
        console.error("[ui-inject] failed:", e.message);
      });
    } catch (e) {
      console.error("[ui-inject] load error:", e.message);
    }
  });
}

function createShellWindow() {
  if (shellWindow && !shellWindow.isDestroyed()) {
    shellWindow.show();
    shellWindow.focus();
    return shellWindow;
  }
  shellWindow = new BrowserWindow({
    width: 1080,
    height: 760,
    minWidth: 860,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    icon: ICON_PATH,
    backgroundColor: "#f5f6f8",
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "bridge.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  shellWindow.loadFile(SHELL_HTML);
  shellWindow.once("ready-to-show", () => shellWindow.show());
  shellWindow.on("closed", () => { shellWindow = null; });
  return shellWindow;
}

function getWindow() {
  return mainWindow;
}

function showWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function showShellWindow() {
  return createShellWindow();
}

function registerIpc() {
  ipcMain.handle("config:get", () => config.get());
  ipcMain.handle("config:set", (e, patch) => {
    const prev = config.get().skin;
    const data = config.set(patch);
    if (patch && typeof patch.skin === "string" && patch.skin !== prev) {
      broadcastSkin(patch.skin);
    }
    return data;
  });
  ipcMain.handle("config:setMount", (e, key, value) => config.setMount(key, value));

  ipcMain.handle("config:saveEnvKey", (e, key) => {
    try {
      const fs = require("fs");
      const envPath = path.join(config.get().enginePath, ".env");
      let content = "";
      if (fs.existsSync(envPath)) content = fs.readFileSync(envPath, "utf8");
      const keyEnv = config.get().api.keyEnv || "DEEPSEEK_API_KEY";
      if (content.includes(keyEnv)) {
        content = content.replace(new RegExp(`^${keyEnv}=.*$`, "m"), `${keyEnv}=${key}`);
      } else {
        content += `${keyEnv}=${key}\n`;
      }
      fs.writeFileSync(envPath, content, "utf8");
      return { ok: true, envPath };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle("backend:getState", () => backend.getState());
  ipcMain.handle("backend:start", () => { backend.start(); return backend.getState(); });
  ipcMain.handle("backend:stop", () => { backend.stop(); return backend.getState(); });
  ipcMain.handle("backend:restart", () => { backend.restart(); return backend.getState(); });

  ipcMain.handle("fs:exists", (e, p) => {
    try { return require("fs").existsSync(p); } catch { return false; }
  });

  ipcMain.handle("ollama:start", async () => {
    const { spawn } = require("child_process");
    const fs = require("fs");
    const os = require("os");
    const candidates = [
      path.join(process.env.LOCALAPPDATA || "", "Programs", "Ollama", "ollama.exe"),
      path.join(os.homedir(), "AppData", "Local", "Programs", "Ollama", "ollama.exe"),
      "C:\\Program Files\\Ollama\\ollama.exe"
    ];
    const exe = candidates.find((p) => fs.existsSync(p));
    if (!exe) return { ok: false, error: "ollama.exe 未找到(常见路径已扫描)" };
    return new Promise((resolve) => {
      const child = spawn(exe, ["serve"], { detached: true, stdio: "ignore" });
      child.unref();
      setTimeout(() => resolve({ ok: true }), 1500);
    });
  });

  ipcMain.handle("om:start", async () => {
    const { execFile } = require("child_process");
    const fs = require("fs");
    const script = "F:\\OpenMemory\\start-om.ps1";
    if (!fs.existsSync(script)) return { ok: false, error: "start-om.ps1 未找到" };
    return new Promise((resolve) => {
      execFile("powershell", ["-ExecutionPolicy", "Bypass", "-File", script], { timeout: 90000 }, (err) => {
        resolve(err ? { ok: false, error: err.message } : { ok: true });
      });
    });
  });

  ipcMain.handle("window:minimize", () => { const w = getActiveWindow(); if (w) w.minimize(); });
  ipcMain.handle("window:maximize", () => {
    const w = getActiveWindow();
    if (!w) return;
    if (w.isMaximized()) w.unmaximize(); else w.maximize();
  });
  ipcMain.handle("window:close", () => {
    const w = getActiveWindow();
    if (w) w.hide();
  });
  ipcMain.handle("window:openExternal", (e, url) => {
    if (typeof url === "string" && url.startsWith("http")) shell.openExternal(url);
  });
  ipcMain.handle("window:openPath", (e, p) => {
    if (typeof p === "string" && require("fs").existsSync(p)) shell.openPath(p);
  });
  ipcMain.handle("window:openShell", () => {
    showWindow();
    return { ok: true };
  });

  ipcMain.handle("ui:getConfig", () => config.get());
  ipcMain.handle("tokenizer:count", (e, text) => tokenizer.count(text));
  ipcMain.handle("ui:winMinimize", () => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize(); });
  ipcMain.handle("ui:winMaximize", () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMaximized()) mainWindow.unmaximize(); else mainWindow.maximize();
  });
  ipcMain.handle("ui:winClose", () => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.hide(); });
  ipcMain.handle("ui:winIsMaximized", () => !!(mainWindow && !mainWindow.isDestroyed() && mainWindow.isMaximized()));

  // ── 皮肤: 与 renderer/skins.js 的 SKIN_IDS 对齐 ──────────────────
  const SKIN_IDS = ["default-light", "default-dark", "codex-dark", "vscode-dark", "onedark", "tokyo-night", "nord", "kanagawa", "solarized", "gruvbox", "berserk"];
  function broadcastSkin(id) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("ui:skin-changed", id);
    }
    if (shellWindow && !shellWindow.isDestroyed()) {
      shellWindow.webContents.send("ui:skin-changed", id);
    }
  }
  ipcMain.handle("skin:set", (e, id) => {
    if (typeof id !== "string" || !SKIN_IDS.includes(id)) return config.get().skin;
    config.set({ skin: id });
    broadcastSkin(id);
    return id;
  });

  backend.onStateChange((s) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("backend:state", s);
    }
    if (shellWindow && !shellWindow.isDestroyed()) {
      shellWindow.webContents.send("backend:state", s);
    }
  });
}

function getActiveWindow() {
  const w = BrowserWindow.getFocusedWindow();
  return w || mainWindow || shellWindow;
}

module.exports = { createMainWindow, getWindow, showWindow, showShellWindow, registerIpc, loadWebUi };