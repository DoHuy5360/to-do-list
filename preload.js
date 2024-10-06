const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const dependency of ["chrome", "node", "electron"]) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("electronAPI", {
    ping: () => ipcRenderer.invoke("test:ping"),
    ping02: (arg) => ipcRenderer.send("test:ping02", arg),
    getEventList: () => ipcRenderer.invoke("getEventList"),
});

contextBridge.exposeInMainWorld("task", {
    registerCallback: (callback) => {
        ipcRenderer.on("task:display", (event, data) => {
            callback(data);
        });
    },
});
