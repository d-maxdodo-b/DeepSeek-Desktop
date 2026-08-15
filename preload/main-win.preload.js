const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dshUi", {
  getConfig: () => ipcRenderer.invoke("ui:getConfig"),
  countTokens: (text) => ipcRenderer.invoke("tokenizer:count", text),
  setSkin: (id) => ipcRenderer.invoke("skin:set", id),
  onSkinChange: (fn) => ipcRenderer.on("ui:skin-changed", (e, skin) => fn(skin)),
  win: {
    minimize: () => ipcRenderer.invoke("ui:winMinimize"),
    maximize: () => ipcRenderer.invoke("ui:winMaximize"),
    close: () => ipcRenderer.invoke("ui:winClose"),
    isMaximized: () => ipcRenderer.invoke("ui:winIsMaximized"),
    onMaximized: (fn) => ipcRenderer.on("ui:win-maximized", (e, max) => fn(max))
  }
});