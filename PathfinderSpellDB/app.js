const { app, BrowserWindow, Menu } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');
const { ipcMain } = require('electron')

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false;

ipcMain.on("start-download", (ev) => {
    autoUpdater.downloadUpdate().then(() => {
        log.log("Download complete event - sending back to window");
        ev.sender.send("update-downloaded");
    });
});
ipcMain.on("start-download-restart", () => {
    autoUpdater.downloadUpdate().then(() => {
        log.log("Download complete event - quitting and restarting");
        setImmediate(() => autoUpdater.quitAndInstall());
    });
});

function handleStartupEvent() {
    if (process.platform !== 'win32') {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    var squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
};


if (!handleStartupEvent()) {
    const menuTemplate = [{
        'label': 'File',
        'submenu': [
            {
                'label': 'Always on top',
                'type': 'checkbox',
                'checked': false,
                'click'(item, win) {
                    win.setAlwaysOnTop(item.checked);
                }
            },
            { 'role': 'reload' },
            { 'type': 'separator' },
            { 'role': 'toggleDevTools' },
            {
                'label': 'About',
                'click'(item, win) {
                    let aboutWindow = new BrowserWindow({
                        width: 600,
                        height: 400,
                        webPreferences: {
                            nodeIntegration: true
                        },
                        autoHideMenuBar: !isDev
                    })
                    aboutWindow.loadFile('about.html');
                    aboutWindow.webContents.on("did-finish-load", () => {
                        aboutWindow.webContents.send('version', app.getVersion());
                    });
                }
            },
            {
                'label': 'Check For Updates',
                'click'(item, win) {
                    let versionWindow = new BrowserWindow({
                        width: 600,
                        height: 400,
                        webPreferences: {
                            nodeIntegration: true
                        },
                        autoHideMenuBar: !isDev
                    })
                    versionWindow.loadFile('update.html');
                    versionWindow.webContents.on("did-finish-load", () => {
                        versionWindow.webContents.send("version", app.getVersion());
                        if (!isDev) {
                            autoUpdater.checkForUpdates().then((r) => {
                                versionWindow.webContents.send("update-info", r.updateInfo);
                            }, (r) => {
                                versionWindow.webContents.send("update-error", r);
                            });
                        } else {
                            setTimeout(() => {
                                versionWindow.webContents.send("update-info", {
                                    'version': app.getVersion(),
                                    'releaseNotes': "Detected development mode - pretending to be latest\n\nIf you're not developing something very bad has happened!",
                                    'releaseDate': '2018-05-01T15:29:31.000Z'
                                });
                            }, 3000);
                        }
                    });
                }
            },
            { 'type': 'separator' },
            { 'role': 'close' }
        ]
    }];

    let mainWindow;

    app.on('ready', function createWindow() {
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        })
        mainWindow.loadFile('index.html')
        mainWindow.on('closed', function () { mainWindow = null });
    });

    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow()
        }
    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });
}