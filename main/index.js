const { app, globalShortcut, Menu } = require("electron");
const config = require("./config");
const backend = require("./backend");
const tokenizer = require("./tokenizer");
const { createMainWindow, registerIpc, showWindow, showShellWindow, getWindow, loadWebUi } = require("./window");
const { createTray, applyAutoStart } = require("./tray");

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => showWindow());

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    registerIpc();
    createMainWindow();

    if (!config.get().enginePath) {
      setTimeout(() => showShellWindow(), 800);
    }

    const tray = createTray({
      app,
      win: () => getWindow(),
      backend,
      showWindow,
      showShellWindow,
      quit: () => {
        backend.stop();
        app.quit();
      }
    });

    applyAutoStart(app, config.get().autoStart);

    const hotkey = config.get().hotkey || "Ctrl+Alt+D";
    try {
      globalShortcut.register(hotkey, () => showWindow());
    } catch (e) {
      console.error("[hotkey] register failed:", e.message);
    }

    backend.onStateChange((s) => {
      if (s === "running") {
        setTimeout(() => loadWebUi(), 1500);
      }
    });

    backend.start();
  });

  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
    tokenizer.stop();
  });

  app.on("window-all-closed", (e) => {
    e.preventDefault();
  });
}