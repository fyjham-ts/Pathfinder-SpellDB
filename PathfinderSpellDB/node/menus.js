const { BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');
const updateManager = require("./updateManager");

var menuItems = {
    'alwaysOnTop': {
        'label': 'Always on top',
        'type': 'checkbox',
        'checked': false,
        'click'(item, win) {
            win.setAlwaysOnTop(item.checked);
        }
    },
    'checkUpdates': {
        'label': 'Check For Updates',
        'click'(item, win) {
            updateManager.openDialog();
        }
    },
    'about': {
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
    'quickRef': {
        'label': 'Quick Reference',
        'click': function (item, win) {
            let quickRefWindow = new BrowserWindow({
                width: 600,
                height: 400,
                webPreferences: {
                    nodeIntegration: true
                }
            });
            quickRefWindow.setMenu(Menu.buildFromTemplate(quickRefMenuTemplate));
            quickRefWindow.loadFile('quickref.html');
            quickRefWindow.on('closed', function () { quickRefWindow = null });
        }
    }
};
var quickRefMenuTemplate = [
    {
        'label': 'File',
        'submenu': [
            menuItems.alwaysOnTop,
            { 'role': 'close' }
        ]
    }
];

var mainMenuTemplate = [
    {
        'label': 'File',
        'submenu': [
            menuItems.alwaysOnTop,
            { 'type': 'separator' },
            menuItems.checkUpdates,
            { 'role': 'reload' },
            { 'role': 'toggleDevTools' },
            { 'type': 'separator' },
            menuItems.about,
            { 'type': 'separator' },
            { 'role': 'close' }
        ]
    }, {
        'label': 'Other',
        'submenu': [
            menuItems.quickRef
        ]
    }
];
module.exports = {
    mainMenuTemplate: mainMenuTemplate
};