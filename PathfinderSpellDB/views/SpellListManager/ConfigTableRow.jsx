'use babel';

import React from 'react';

export default class ConfigTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.nameChanged = this.nameChanged.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }
    toggleEdit() {
        this.props.onToggleEdit(this.props.SpellList);
    }
    deleteList() {
        this.props.onDeleteList(this.props.SpellList);
    }
    nameChanged(event) {
        this.props.onNameChange(this.props.SpellList, event.target.value);
    }
    render() {
        return (
            <tr className="spellListRow">
                <td><input className="form-control" type="text" name="name" value={this.props.SpellList.name} onChange={this.nameChanged} /></td>
                <td>{this.props.SpellList.spellCount}</td>
                <td>
                    <a className={"btn btn-default" + (this.props.isEditList ? " editList" : "")} onClick={this.toggleEdit}>
                        {this.props.isEditList ?
                            <i className="fas fa-check-circle"></i> :
                            <i className="far fa-circle"></i>
                        }
                    </a>
                </td>
                <td>
                    {this.props.canDelete && !this.props.isEditList && <a className="btn btn-danger" onClick={this.deleteList}><i className="far fa-trash-alt"></i></a>}
                </td>
            </tr>
        )
    }
};  