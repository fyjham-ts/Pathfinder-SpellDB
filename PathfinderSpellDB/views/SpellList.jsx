'use babel';

import React from 'react';
import SpellSearch from '../views/SpellSearch.jsx'
import SpellListItem from '../views/SpellListItem.jsx'
import SpellDetail from '../views/SpellDetail.jsx'
import update from 'immutability-helper';
import { loadSpellData } from '../scripts/SpellLoader.js';

let { spells, powerTypes, powerOptions } = loadSpellData();

var defaultMaxRows = 50;

export default class SpellList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spells: spells,
            maxRows: defaultMaxRows,
            criteria: {
                'spellName': '',
                'powerType': '',
                'powerOption': '',
                'sortBy': 'Level',
                'displayMode': 'List',
                'levels': []
            },
            selectedSpell: null
        };
        this.criteriaChange = this.criteriaChange.bind(this);
        this.criteriaSort = this.criteriaSort.bind(this);
        this.meetsCriteria = this.meetsCriteria.bind(this);
        this.selectSpell = this.selectSpell.bind(this);
        this.showMore = this.showMore.bind(this);
    }
    showMore() {
        this.setState((s) => { return { 'maxRows': s.maxRows + defaultMaxRows } });
    }
    meetsCriteria(spell) {
        if (this.state.criteria.spellName) {
            if (spell.name.toLowerCase().indexOf(this.state.criteria.spellName) == -1) return false;
        }
        if (this.state.criteria.powerType) {
            if (this.state.criteria.powerType == "Spells") {
                if (spell.type.toLowerCase() != "spell") return false;
            } else if (this.state.criteria.powerType == "None") {
                if (spell.type.toLowerCase() == "spell" || spell.powers.length > 0) return false;
            }else {
                if (spell.powers.filter((p) => {
                    return (p.powerType == this.state.criteria.powerType) &&
                        (!this.state.criteria.powerOption || p.powerOption == this.state.criteria.powerOption)
                }).length == 0) return false;
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
    criteriaChange(name, value) {
        if (name == "powerType") {
            this.setState({
                criteria: update(this.state.criteria, {
                    [name]: { $set: value },
                    powerOption: { $set: "" }
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
        if (selectedSpell && this.state.criteria.displayMode == 'List') detail = <div className="col-sm selectedSpell"><SpellDetail spell={selectedSpell} /></div>
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <SpellSearch
                            powerTypes={powerTypes}
                            powerOptions={powerOptions}
                            sortOptions={["Name", "Level"]}
                            displayModes={["List", "Details"]}
                            powerType={this.state.criteria.powerType}
                            spellName={this.state.criteria.spellName}
                            sortBy={this.state.criteria.sortBy}
                            levels={this.state.criteria.levels}
                            displayMode={this.state.criteria.displayMode}
                            showDetails={this.state.criteria.showDetails}
                            onCriteriaChange={this.criteriaChange} />
                    </div>
                </div>
                <div className="row">
                    <div className={"col-sm spellList" + this.state.criteria.displayMode}>
                        <ul className="list-group">
                            {visibleSpells.map((s) => {
                                if (this.state.criteria.displayMode == "Details") return <SpellDetail key={s.name} spell={s} />
                                else return <SpellListItem key={s.name} spell={s} selected={s == selectedSpell} onSelect={this.selectSpell} />
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