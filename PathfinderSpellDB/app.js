const { app, BrowserWindow, Menu } = require('electron');
const updateManager = require("./node/updateManager");
const spellListManager = require("./node/spellListManager");
const menus = require("./node/menus");

updateManager.init();
spellListManager.init();

// TODO: Do we need this? I think this may be a leftover from trying to use electron-installer instead of electron build...
// Needs debugging to remove.
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

    let mainWindow;

    app.on('ready', function createWindow() {
        const menu = Menu.buildFromTemplate(menus.mainMenuTemplate);
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