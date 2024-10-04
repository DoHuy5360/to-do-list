const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

function getView(name) {
	return `./views/${name}.html`
}

const isMac = process.platform !== "darwin";
const isDev = process.env.NODE_ENV !== "development";
const createWindow = () => {
	const win = new BrowserWindow({
		width: 600,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	if (isDev) {
		win.webContents.openDevTools();
	}
	const menu = Menu.buildFromTemplate([
		{
			label: app.name,
			submenu: [
				{
					click: () => win.webContents.send("openPopup", 1),
					label: "open popup",
				},
				{
					click: () => win.webContents.send("option02", -1),
					label: "view 2",
				},
			],
		},
	]);

	Menu.setApplicationMenu(menu);
	win.loadFile("./views/index.html");
	return {
		win,
	};
};
let popupWindow;
function createPopupWindow() {
	const { screen } = require('electron');
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	const WINDOW_WIDTH = 600;
	const WINDOW_HEIGHT = 400;
	const WINDOW_MARGIN = 10;

	popupWindow = new BrowserWindow({
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		x: width - (WINDOW_WIDTH + WINDOW_MARGIN),
		y: height - (WINDOW_HEIGHT + WINDOW_MARGIN),
		frame: false, // Hide window frame
		alwaysOnTop: true,
		transparent: true,
		resizable: false,
		webPreferences: {
			// nodeIntegration: true, // allow to use node functions in browser directly
			contextIsolation: true, // opposite to nodeIntegration, required for using global api communicate ipc
			preload: path.join(__dirname, "de.js"),
		},
	});
	if (true) {
		popupWindow.webContents.openDevTools();
	}
	popupWindow.loadFile(getView("popup"));
}

function closePopupWindow() {
	if (popupWindow) {
		popupWindow.close();
		popupWindow = null; // Giải phóng tham chiếu
	}
}

app.on("ready", () => {
	const { win } = createWindow();
	ipcMain.on("openPopup", (event, arg) => {
		createPopupWindow()
	});
	ipcMain.on("view2", (event, arg) => {
		win.loadFile("./views/second.html");
	});
	ipcMain.handle("test:ping", () => "pong");
	ipcMain.on("test:ping02", (event, arg) => console.log(arg));

	app.on("activate", () => {
		const isNoWindowExisting = BrowserWindow.getAllWindows().length === 0;
		if (isNoWindowExisting) createWindow();
	});
	ipcMain.on("closePopup", () => {
		console.log("closePopup")
		closePopupWindow()
	})
});

app.on("window-all-closed", () => {
	if (isMac) app.quit();
});
