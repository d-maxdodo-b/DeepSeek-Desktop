const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dsh", {
  config: {
    get: () => ipcRenderer.invoke("config:get"),
    set: (patch) => ipcRenderer.invoke("config:set", patch),
    setMount: (key, value) => ipcRenderer.invoke("config:setMount", key, value),
    saveEnvKey: (key) => ipcRenderer.invoke("config:saveEnvKey", key)
  },
  backend: {
    getState: () => ipcRenderer.invoke("backend:getState"),
    start: () => ipcRenderer.invoke("backend:start"),
    stop: () => ipcRenderer.invoke("backend:stop"),
    restart: () => ipcRenderer.invoke("backend:restart"),
    onState: (fn) => ipcRenderer.on("backend:state", (e, s) => fn(s))
  },
  fs: {
    exists: (p) => ipcRenderer.invoke("fs:exists", p)
  },
  ollama: {
    start: () => ipcRenderer.invoke("ollama:start")
  },
  om: {
    start: () => ipcRenderer.invoke("om:start")
  },
  win: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    maximize: () => ipcRenderer.invoke("window:maximize"),
    close: () => ipcRenderer.invoke("window:close"),
    openExternal: (url) => ipcRenderer.invoke("window:openExternal", url),
    openPath: (p) => ipcRenderer.invoke("window:openPath", p),
    openShell: () => ipcRenderer.invoke("window:openShell"),
    onMaximized: (fn) => ipcRenderer.on("window:maximized", (e, max) => fn(max))
  }
});