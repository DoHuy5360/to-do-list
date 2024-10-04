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
contextBridge.exposeInMainWorld("menuBarAPI", {
	handleOption01: (callback) => ipcRenderer.on("openPopup", callback),
	handleOption02: (callback) => ipcRenderer.on("option02", callback),
});
contextBridge.exposeInMainWorld("electronAPI", {
	ping: () => ipcRenderer.invoke("test:ping"),
	ping02: (arg) => ipcRenderer.send("test:ping02", arg),
});
