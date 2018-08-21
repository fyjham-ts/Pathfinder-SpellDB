const { BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');
const updateManager = require("./updateManager");
var menuTemplate = [
    {
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
            { 'type': 'separator' },
            {
                'label': 'Check For Updates',
                'click'(item, win) {
                    updateManager.openDialog();
                }
            },
            { 'role': 'reload' },
            { 'role': 'toggleDevTools' },
            { 'type': 'separator' },
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
                    });
                    aboutWindow.loadFile('about.html');
                    aboutWindow.on('closed', function () { aboutWindow = null });
                }
            },
            { 'type': 'separator' },
            { 'role': 'close' }
        ]
    }, {
        'label': 'Other',
        'submenu': [
            {
                'label': 'Quick Reference',
                'click': function (item, win) {
                    let quickRefWindow = new BrowserWindow({
                        width: 600,
                        height: 400,
                        webPreferences: {
                            nodeIntegration: true
                        },
                        autoHideMenuBar: !isDev
                    });
                    quickRefWindow.setMenu(Menu.buildFromTemplate(menuTemplate));
                    quickRefWindow.loadFile('quickref.html');
                    quickRefWindow.on('closed', function () { quickRefWindow = null });
                }
            }
        ]
    }
];
module.exports = {
    mainMenuTemplate: menuTemplate
};