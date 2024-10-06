const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const path = require("path");
const { db } = require("./connections/mongodb");
const { CronJob } = require("cron");

function getView(name) {
    return `./views/${name}.html`;
}

const isMac = process.platform !== "darwin";
const isDev = process.env.NODE_ENV !== "development";
const createWindow = () => {
    const { screen } = require("electron");
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width,
        height,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    win.maximize();

    if (isDev) {
        win.webContents.openDevTools();
    }
    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => createPopupWindow(),
                    label: "open popup",
                },
                {
                    click: () => win.webContents.send("option02", -1),
                    label: "view 2",
                },
                {
                    click: () => win.webContents.send("event-name", "12983913"),
                    label: "shooting event with data",
                },
            ],
        },
    ]);

    Menu.setApplicationMenu(menu);
    win.loadFile("./views/index.html")
        .then(async () => {
            if (!db.isConnected) {
                await db.connect();
            }

            new CronJob(
                "* * * * *", // 5 stars is every one minute
                () => {
                    console.log("Cron executed");
                    createPopupWindow();
                },
                null,
                false,
                "Asia/Ho_Chi_Minh",
            );
        })
        .then(async () => {
            win.webContents.send(
                "task:display",
                await db.events.find({}).toArray(),
            );
        })
        .catch((e) => {
            console.error(e);
        });

    win.on("close", (e) => {
        e.preventDefault();
        win.hide();
    });
    return {
        win,
    };
};
let popupWindow;
function createPopupWindow() {
    const { screen } = require("electron");
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
        popupWindow = null;
    }
}

app.on("ready", async () => {
    const { win } = createWindow();
    ipcMain.on("view2", (event, arg) => {
        win.loadFile("./views/second.html");
    });
    ipcMain.handle("test:ping", () => "pong");

    app.on("activate", () => {
        const isNoWindowExisting = BrowserWindow.getAllWindows().length === 0;
        if (isNoWindowExisting) createWindow();
    });
    //  task
    ipcMain.handle("task:save:request", async (event, arg) => {
        const { acknowledged } = await db.events.insertOne({
            content: arg,
        });
        return acknowledged;
    });

    // popup
    ipcMain.on("popup:close", () => {
        closePopupWindow();
    });

    //
    ipcMain.handle("getEventList", async () => {
        return await db.events.find({}).toArray();
    });

    //
    createTray(win);
});

function createTray(mainWindow) {
    const tray = new Tray(path.join(__dirname, "media/server.ico"));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open app",
            click: () => {
                mainWindow.show();
            },
        },
        {
            label: "Quit app",
            click: () => {
                app.quit();
            },
        },
    ]);

    tray.setToolTip("To do list");
    tray.setContextMenu(contextMenu);

    tray.on("double-click", () => {
        mainWindow.show();
    });
}

app.on("window-all-closed", () => {
    if (isMac) app.quit();
});
