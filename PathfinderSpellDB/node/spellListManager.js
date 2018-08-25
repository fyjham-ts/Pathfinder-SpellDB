const { ipcMain } = require('electron');
const fs = require('fs');
const storage = require('electron-json-storage');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

class SpellListManager {
    constructor() {
        this.spellListData = null;
        this.listeningContexts = [];
    }
    init() {
        var dataLoading = this._loadStorage();
        ipcMain.on("spelllists-load", (ev) => {
            if (this.listeningContexts.indexOf(ev.sender) == -1) this.listeningContexts.push(ev.sender);
            dataLoading.then(() => {
                ev.sender.send("spelllists-dataupdate", this.spellListData.lists);
                ev.sender.send("spelllists-editlistupdate", this.spellListData.editList);
            });
        });
        dataLoading.then(() => {
            ipcMain.on("spelllists-newlist", (ev) => {
                this.spellListData.lists.push(this._newList());
                this._applyChanges(true, false);
            });
            ipcMain.on("spelllists-seteditlist", (ev, id) => {
                if (this._findList(id)) this.spellListData.editList = id;
                this._applyChanges(false, true);
            });
            ipcMain.on("spelllists-updatelistname", (ev, id, name) => {
                var list = this._findList(id);
                if (list) {
                    list.name = name;
                    this._applyChanges(true, false);
                }
                else throw "Couldn't find list " + id;
            });
            ipcMain.on("spelllists-savespelllist", (ev, id, path) => {
                var list = this._findList(id);
                if (list) {
                    fs.writeFile(path, JSON.stringify(list), { "encoding": "ascii" }, ex => {
                        if (ex) ev.sender.send("background-error", "Error writing to file: " + ex.message);
                    });
                }
            });
            ipcMain.on("spelllists-loadspelllist", (ev, path) => {
                fs.readFile(path, (ex, json) => {
                    if (ex) ev.sender.send("background-error", "Error writing to file: " + ex.message);
                    else {
                        var fail = false;
                        var newList;
                        try {
                            newList = JSON.parse(json);
                            if (!newList.id) fail = true;
                            if (!newList.spells) fail = true;
                            if (typeof (newList.spellCount) != 'number') fail = true;
                        }
                        catch (ex) {
                            fail = true;
                        }
                        if (!fail) {
                            // Give it a new ID - just in case it already exists
                            newList.id = uuidv4();
                            this.spellListData.lists.push(newList);
                            this._applyChanges(true, false);
                        }
                        if (fail) 
                            ev.sender.send("background-error", "Unable to load file - the file does not appear to be a valid Spell List");
                    }

                });
            });
            ipcMain.on("spelllists-deletespelllist", (ev, id) => {
                var list = this._findList(id);
                var idx = this.spellListData.lists.indexOf(list);
                if (idx != -1) this.spellListData.lists.splice(idx, 1);
                this._applyChanges(true, false);
            });
            ipcMain.on("spelllists-toggleSpell", (ev, name) => {
                var list = this._findList(this.spellListData.editList);
                if (list) {
                    list.spells[name] = !list.spells[name];

                    if (list.spells[name]) list.spellCount++;
                    else list.spellCount--;

                    this._applyChanges(true, false);
                }
                else throw "Couldn't find list " + this.spellListData.editList;
            });
        });
    }
    _applyChanges(lists, editItem) {
        storage.set("spellListData", this.spellListData, () => {
            for (var i = 0; i < this.listeningContexts.length; i++) {
                if (this.listeningContexts[i].isDestroyed()) {
                    this.listeningContexts.splice(i, 1);
                    i--;
                }
                else {
                    if (lists) this.listeningContexts[i].send("spelllists-dataupdate", this.spellListData.lists);
                    if (editItem) this.listeningContexts[i].send("spelllists-editlistupdate", this.spellListData.editList);
                }
            }
        });
    }
    _findList(id) {
        return this.spellListData.lists.find((l) => l.id == id);
    }
    _loadStorage() {
        return new Promise((resolve) => {
            storage.get("spellListData", (e, d) => {
                // Make sure we got spell data - we always want 1 active list
                if (d) this.spellListData = d;
                else this.spellListData = {};

                if (!this.spellListData.lists) {
                    var newList = this._newList();
                    newList.name = "Bookmarks";
                    this.spellListData.lists = [newList];
                }
                if (!this.spellListData.editList)
                    this.spellListData.editList = this.spellListData.lists[0].id;

                resolve();
            });
        });
    }
    _newList() {
        return {
            "id": uuidv4(),
            "name": "",
            "spellCount": 0,
            "spells": {}
        }
    }
};

module.exports = new SpellListManager();