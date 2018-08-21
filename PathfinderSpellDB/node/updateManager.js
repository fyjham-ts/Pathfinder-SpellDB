const { app, BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');

var mgr = {
    'init': function () {
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
    },
    'openDialog': function () {
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
        versionWindow.on('closed', function () { versionWindow = null });
    }
};
module.exports = mgr;
