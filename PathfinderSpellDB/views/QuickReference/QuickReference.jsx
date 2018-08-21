'use babel';

import React from 'react';
import QuickReferenceTile from '../../views/QuickReference/QuickReferenceTile.jsx';
import Conditions from '../../views/QuickReference/Conditions.jsx';
import DcTable from '../../views/QuickReference/DcTable.jsx';

var quickRefs = [
    {
        "label": "Conditions",
        "icon": "fa fa-allergies",
        "render": () => <Conditions />
    },
    {
        "label": "DC Table",
        "icon": "fa fa-table",
        "render": () => <DcTable />
    }
];

export default class QuickReference extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeRef: null
        };
        this.selectReference = this.selectReference.bind(this);
    }
    selectReference(quickRef) {
        this.setState({'activeRef': quickRef})
    }
    render() {
        if (this.state.activeRef) {
            return <div>
                {this.state.activeRef.render()}
            </div>;
        }
        else {
            return <div className="quickRefs">
                {quickRefs.map((r) => <QuickReferenceTile key={r.label} QuickReference={r} onSelect={this.selectReference} /> )}
            </div>
        }
    }
}