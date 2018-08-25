'use babel';

import React from 'react';
import { ipcRenderer } from 'electron';
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
        this.onAddList = this.onAddList.bind(this);
        this.bindIpcEvents();
    }
    onToggleEdit(list) {
        if (this.state.editList != list.id)
            ipcRenderer.send("spelllists-seteditlist", list.id);
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
            <div>
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
                            onToggleEdit={this.onToggleEdit} />
                        )}
                    </tbody>
                </table>
                <button className="btn btn-success" onClick={this.onAddList}>+</button>
            </div>
        )
    }
};  