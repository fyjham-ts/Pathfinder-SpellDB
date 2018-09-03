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
            aboutWindow.loadFile('pages/about.html');
            aboutWindow.on('closed', function () { aboutWindow = null });
        }
    },
    'randomNpc': {
        'label': 'Random NPC',
        'click': function (item, win) {
            let randomWindow = new BrowserWindow({
                width: 840,
                height: 680,
                webPreferences: {
                    nodeIntegration: true
                }
            });
            randomWindow.setMenu(Menu.buildFromTemplate(genericMenuTemplate));
            randomWindow.loadFile('pages/randomgen.html');
            randomWindow.on('closed', function () { randomWindow = null });
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
            quickRefWindow.setMenu(Menu.buildFromTemplate(genericMenuTemplate));
            quickRefWindow.loadFile('pages/quickref.html');
            quickRefWindow.on('closed', function () { quickRefWindow = null });
        }
    },
    'spellLists': {
        'label': 'Bookmarked Spell Lists',
        'click': function (item, win) {
            let spellListWindow = new BrowserWindow({
                width: 600,
                height: 400,
                webPreferences: {
                    nodeIntegration: true
                }
            });
            spellListWindow.setMenu(Menu.buildFromTemplate(genericMenuTemplate));
            spellListWindow.loadFile('pages/spelllists.html');
            spellListWindow.on('closed', function () { spellListWindow = null });
        }
    }
};
var genericMenuTemplate = [
    {
        'label': 'File',
        'submenu': [
            menuItems.alwaysOnTop,
            { 'role': 'reload' },
            { 'role': 'toggleDevTools' },
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
            menuItems.randomNpc,
            menuItems.quickRef,
            menuItems.spellLists
        ]
    }
];
module.exports = {
    mainMenuTemplate: mainMenuTemplate
};