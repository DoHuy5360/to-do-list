const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("de", {
    closePopup: () => ipcRenderer.send("closePopup")
});
