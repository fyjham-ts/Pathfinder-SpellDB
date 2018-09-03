import React from 'react';
import QuickReferenceTile from '../../views/QuickReference/QuickReferenceTile.jsx';
import QuickReferenceList from '../../views/QuickReference/QuickReferenceList.jsx';
import DcTable from '../../views/QuickReference/DcTable.jsx';


export default class QuickReference extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeRef: null
        };
        this.selectReference = this.selectReference.bind(this);
        var conditions = require("../../data/QuickReference/Conditions.json");
        var weaponTraits = require("../../data/QuickReference/WeaponTraits.json");
        var monsterAbilities = require("../../data/QuickReference/MonsterAbilities.json");
        this.quickRefs = [
            {
                "label": "Conditions",
                "icon": "fa fa-allergies",
                "render": () => <QuickReferenceList list={conditions} />
            },
            {
                "label": "DC Table",
                "icon": "fa fa-table",
                "render": () => <DcTable />
            },
            {
                "label": "Monster Abilties",
                "icon": "fab fa-optin-monster",
                "render": () => <QuickReferenceList list={monsterAbilities} />
            },
            {
                "label": "Weapon Traits",
                "icon": "fas fa-utensils",
                "render": () => <QuickReferenceList list={weaponTraits} />
            },
        ];
    }
    selectReference(quickRef) {
        this.setState({ 'activeRef': quickRef });
    }
    render() {
        if (this.state.activeRef) {
            return <div>
                {this.state.activeRef.render()}
            </div>;
        }
        else {
            return <div className="quickRefs">
                {this.quickRefs.map((r) => <QuickReferenceTile key={r.label} QuickReference={r} onSelect={this.selectReference} />)}
            </div>;
        }
    }
}