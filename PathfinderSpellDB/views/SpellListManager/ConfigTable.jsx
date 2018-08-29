import React from 'react';
import { ipcRenderer, remote } from 'electron';
import update from 'immutability-helper';
import ConfigTableRow from './ConfigTableRow';

export default class ConfigTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'lists': [],
            'editList': null
        };
        this.onToggleEdit = this.onToggleEdit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onDeleteList = this.onDeleteList.bind(this);
        this.onSaveList = this.onSaveList.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
        this.onAddList = this.onAddList.bind(this);
        this.bindIpcEvents();
    }
    onToggleEdit(list) {
        if (this.state.editList != list.id)
            ipcRenderer.send("spelllists-seteditlist", list.id);
    }
    onSaveList(list) {
        remote.dialog.showSaveDialog({
            "defaultPath": list.name + ".json",
            "filters": [
                {"name": "SpellDB Files", "extensions": ["json"]}
            ]
        }, function (fileName) {
            if (fileName) ipcRenderer.send("spelllists-savespelllist", list.id, fileName);
        });
    }
    onLoadList(list) {
        remote.dialog.showOpenDialog({
            "filters": [
                { "name": "SpellDB files", "extensions": ["json"] }
            ]
        }, function (fileName) {
            if (fileName && fileName[0]) ipcRenderer.send("spelllists-loadspelllist", fileName[0]);
        });
    }
    onDeleteList(list) {
        ipcRenderer.send("spelllists-deletespelllist", list.id);
    }
    onAddList() {
        ipcRenderer.send("spelllists-newlist");
    }
    onNameChange(list, value) {
        ipcRenderer.send("spelllists-updatelistname", list.id, value);
    }
    bindIpcEvents() {
        ipcRenderer.on("background-error", (ev, msg) => {
            alert(msg);
        });
        ipcRenderer.on('spelllists-dataupdate', (ev, lists) => {
            this.setState({'lists': lists})
        });
        ipcRenderer.on('spelllists-editlistupdate', (ev, id) => {
            this.setState({ 'editList': id })
        });
        ipcRenderer.send("spelllists-load");
    }
    render() {
        return (
            <div className="spellListConfig">
                <table className="table spellListTable">
                    <thead>
                        <tr>
                            <th>List Name</th>
                            <th>Spells</th>
                            <th>Editing</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.lists.map((l) => <ConfigTableRow
                            key={l.id}
                            SpellList={l}
                            canDelete={this.state.lists.length > 1}
                            isEditList={l.id == this.state.editList}
                            onNameChange={this.onNameChange}
                            onDeleteList={this.onDeleteList}
                            onSaveList={this.onSaveList}
                            onToggleEdit={this.onToggleEdit} />
                        )}
                    </tbody>
                </table>
                <div className="global-actions">
                    <button className="btn btn-success" onClick={this.onAddList}>
                        <i className="fas fa-plus"></i>&nbsp;&nbsp;Create New List
                    </button>
                    <button className="btn btn-secondary" onClick={this.onLoadList}>
                        <i className="fas fa-file-upload"></i>&nbsp;&nbsp;Load From File
                    </button>
                </div>
            </div>
        )
    }
};  