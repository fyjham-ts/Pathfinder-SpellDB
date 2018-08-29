const { app, BrowserWindow, Menu } = require('electron');
const updateManager = require("../node/updateManager");
const spellListManager = require("../node/spellListManager");
const menus = require("../node/menus");

updateManager.init();
spellListManager.init();

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
    });
    mainWindow.loadFile('pages/index.html');
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