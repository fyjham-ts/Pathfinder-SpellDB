'use babel';

const storage = require('electron-json-storage');

import React from 'react';
import { ipcRenderer } from 'electron';
import SpellSearch from '../views/SpellSearch.jsx'
import SpellListItem from '../views/SpellListItem.jsx'
import SpellDetail from '../views/SpellDetail.jsx'
import update from 'immutability-helper';
import { loadSpellData } from '../scripts/SpellLoader.js';

let { spells, powerTypes, powerOptions } = loadSpellData();

for (var type in powerOptions) powerOptions[type].sort();
powerTypes.push("Bookmark Lists");
powerOptions["Bookmark Lists"] = [];
powerTypes.sort();

var defaultMaxRows = 50;
var getDefaultCriteria = () => {
    return {
        'spellName': '',
        'powerType': '',
        'powerOption': '',
        'sortBy': 'Level',
        'displayMode': 'Details',
        'levels': []
    }
};

export default class SpellList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            powerTypes: powerTypes,
            powerOptions: powerOptions,
            spells: spells,
            maxRows: defaultMaxRows,
            criteria: getDefaultCriteria(),
            selectedSpell: null,
            spellLists: [],
            editSpellList: null
        };
        this.criteriaReset = this.criteriaReset.bind(this);
        this.criteriaChange = this.criteriaChange.bind(this);
        this.criteriaSort = this.criteriaSort.bind(this);
        this.meetsCriteria = this.meetsCriteria.bind(this);
        this.selectSpell = this.selectSpell.bind(this);
        this.showMore = this.showMore.bind(this);
        this.isBookmarked = this.isBookmarked.bind(this);
        this.bookmarkSpell = this.bookmarkSpell.bind(this);

        ipcRenderer.on('spelllists-dataupdate', (ev, lists) => {
            var oldEditId = this.state.editSpellList ? this.state.editSpellList.id : null;
            this.setState({
                'spellLists': lists,
                'editSpellList': lists.find((l) => l.id == oldEditId),
                'powerOptions': update(this.state.powerOptions, {
                    "Bookmark Lists": {
                        $set: lists.map(l => l.name)
                    }
                })
            });
        });
        ipcRenderer.on('spelllists-editlistupdate', (ev, id) => {
            this.setState({
                'editSpellList': this.state.spellLists.find((l) => l.id == id)
            });
        });
        ipcRenderer.send("spelllists-load");
    }
    isBookmarked(spell) {
        return !!(this.state.editSpellList && this.state.editSpellList.spells[spell.name]);
    }
    bookmarkSpell(spell) {
        ipcRenderer.send("spelllists-toggleSpell", spell.name);
    }
    showMore() {
        this.setState((s) => { return { 'maxRows': s.maxRows + defaultMaxRows } });
    }
    meetsCriteria(spell) {
        if (this.state.criteria.spellName) {
            if (spell.name.toLowerCase().indexOf(this.state.criteria.spellName) == -1) return false;
        }
        if (this.state.criteria.powerType) {
            
            switch (this.state.criteria.powerType) {
                case "None": // Special "None" option - this is used when reviewing if a spell isn't classified.
                    if (spell.type.toLowerCase() == "spell" || spell.powers.length > 0) return false;
                    break;
                case "Bookmark Lists": // Special "Bookmarked" option - this is for ones you've bookmarked for quick reference
                    var list = this.state.spellLists.find(l => l.name == this.state.criteria.powerOption);
                    if (list && !list.spells[spell.name]) return false;
                    break;
                default:
                    if (spell.powers.filter((p) => {
                        return (p.powerType == this.state.criteria.powerType) &&
                            (!this.state.criteria.powerOption || p.powerOption == this.state.criteria.powerOption)
                    }).length == 0) return false;
                    break;
            }
        }
        if (this.state.criteria.levels.length > 0 && this.state.criteria.levels.indexOf(spell.level) == -1) return false;

        return true;
    }
    selectSpell(spell) {
        this.setState({
            selectedSpell: spell
        })
    }
    criteriaReset() {
        var newCriteria = getDefaultCriteria();
        newCriteria.displayMode = this.state.criteria.displayMode;
        this.setState({
            criteria: newCriteria
        })
    }
    criteriaChange(name, value) {
        if (name == "powerType") {
            var powerOption = "";
            if (value == "Bookmark Lists") powerOption = this.state.editSpellList.name;
            this.setState({
                criteria: update(this.state.criteria, {
                    [name]: { $set: value },
                    powerOption: { $set: powerOption }  
                }),
                maxRows: defaultMaxRows
            });
        }
        else {
            this.setState({
                criteria: update(this.state.criteria, {
                    [name]: { $set: value }
                }),
                maxRows: defaultMaxRows
            });
        }
    }
    criteriaSort(lhs, rhs) {
        switch (this.state.criteria.sortBy) {
            case "Name":
                if (lhs.name.toLowerCase() < rhs.name.toLowerCase()) return -1;
                if (lhs.name.toLowerCase() > rhs.name.toLowerCase()) return 1;
                return 0;
            case "Level":
                if (lhs.level - rhs.level != 0) return lhs.level - rhs.level;
                if (lhs.name.toLowerCase() < rhs.name.toLowerCase()) return -1;
                if (lhs.name.toLowerCase() > rhs.name.toLowerCase()) return 1;
                break;
        }
    }
    render() {
        var visibleSpells = this.state.spells.filter(this.meetsCriteria).sort(this.criteriaSort);
        var truncated = false;
        if (visibleSpells.length > this.state.maxRows) {
            visibleSpells = visibleSpells.slice(0, this.state.maxRows);
            truncated = true;
        }

        var selectedSpell = this.state.selectedSpell;
        if ((!selectedSpell || !this.meetsCriteria(selectedSpell)) && visibleSpells.length > 0)
            selectedSpell = visibleSpells[0];

        var detail = null;
        if (selectedSpell && this.state.criteria.displayMode == 'List')
            detail = <div className="col-sm selectedSpell">
                <SpellDetail spell={selectedSpell}
                    bookmarked={this.isBookmarked(selectedSpell)}
                    onBookmark={this.bookmarkSpell} />
            </div>
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <SpellSearch
                            powerTypes={this.state.powerTypes}
                            powerOptions={this.state.powerOptions}
                            sortOptions={["Name", "Level"]}
                            displayModes={["List", "Details"]}
                            powerType={this.state.criteria.powerType}
                            powerOption={this.state.criteria.powerOption}
                            spellName={this.state.criteria.spellName}
                            sortBy={this.state.criteria.sortBy}
                            levels={this.state.criteria.levels}
                            displayMode={this.state.criteria.displayMode}
                            showDetails={this.state.criteria.showDetails}
                            onCriteriaChange={this.criteriaChange}
                            onCriteriaReset={this.criteriaReset} />
                    </div>
                </div>
                <div className="row">
                    <div className={"col-sm spellList" + this.state.criteria.displayMode}>
                        <ul className="list-group">
                            {visibleSpells.map((s) => {
                                if (this.state.criteria.displayMode == "Details")
                                    return <SpellDetail
                                        key={s.name}
                                        spell={s}
                                        bookmarked={this.isBookmarked(s)}
                                        onBookmark={this.bookmarkSpell} />;
                                else
                                    return <SpellListItem
                                        key={s.name}
                                        spell={s}
                                        selected={s == selectedSpell}
                                        onSelect={this.selectSpell}
                                    />;
                            })}
                            {truncated ? <li className="list-group-item list-group-item-info"><a onClick={this.showMore}>Show More...</a></li> : null}
                        </ul>
                    </div>
                    {detail}
                </div>
            </div>
        )
    }
};