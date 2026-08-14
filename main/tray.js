const path = require("path");
const fs = require("fs");
const config = require("./config");

const ICON_DIR = path.join(__dirname, "..", "build", "icons");
const FALLBACK_ICON = path.join(ICON_DIR, "tray-normal.png");

function iconFor(state) {
  const name = state === "running" ? "tray-normal.png"
    : state === "starting" ? "tray-busy.png"
    : "tray-offline.png";
  const p = path.join(ICON_DIR, name);
  return fs.existsSync(p) ? p : FALLBACK_ICON;
}

function createTray({ app, win, backend, showWindow, showShellWindow, quit }) {
  const { Tray, Menu, nativeImage } = require("electron");
  const tray = new Tray(nativeImage.createFromPath(iconFor("stopped")).resize({ width: 16, height: 16 }));
  tray.setToolTip("DSH Desktop");

  const buildMenu = () => {
    const st = backend.getState().state;
    const label =
      st === "running" ? "后端运行中" :
      st === "starting" ? "后端启动中..." :
      st === "crashed" ? "后端已崩溃" : "后端已停止";
    return Menu.buildFromTemplate([
      { label, enabled: false },
      { type: "separator" },
      { label: "显示 Harness", click: () => showWindow() },
      { label: "控制面板", click: () => showShellWindow() },
      { label: "重启后端", click: () => backend.restart() },
      { type: "separator" },
      { label: "开机自启: " + (config.get().autoStart ? "开" : "关"), click: () => toggleAutoStart(app) },
      { type: "separator" },
      { label: "退出", click: () => quit() }
    ]);
  };

  tray.setContextMenu(buildMenu());
  tray.on("click", () => showWindow());

  backend.onStateChange((s) => {
    const img = nativeImage.createFromPath(iconFor(s)).resize({ width: 16, height: 16 });
    tray.setImage(img);
    tray.setContextMenu(buildMenu());
  });

  return tray;
}

function toggleAutoStart(app) {
  const cfg = config.get();
  cfg.autoStart = !cfg.autoStart;
  config.set({ autoStart: cfg.autoStart });
  applyAutoStart(app, cfg.autoStart);
}

function applyAutoStart(app, enabled) {
  const { app: _app } = require("electron");
  if (enabled) {
    _app.setLoginItemSettings({ openAtLogin: true });
  } else {
    _app.setLoginItemSettings({ openAtLogin: false });
  }
}

module.exports = { createTray, applyAutoStart };