const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("task", {
    save: (arg) => ipcRenderer.invoke("task:save:request", arg),
})
contextBridge.exposeInMainWorld("popup", {
    close: () => ipcRenderer.send("popup:close"),
});
