const { app, BrowserWindow, Menu } = require('electron');

function handleStartupEvent() {
    if (process.platform !== 'win32') {
        return false;
    }
    const path = require('path');
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
            { 'role': 'toggleDevTools' },
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

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });

    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow()
        }
    });
}