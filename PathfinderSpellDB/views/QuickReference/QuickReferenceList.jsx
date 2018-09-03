import React from 'react';

export default class Conditions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: {}
        };
        this.toggleExpand = this.toggleExpand.bind(this);
    }
    toggleExpand(name) {
        var expanded = Object.assign({}, this.state.expanded);
        expanded[name] = !expanded[name];
        this.setState({ expanded: expanded });
    }
    render() {
        return <div className="quickRefList accordion">
            {this.props.list.map((c) => <div key={c.name} className="card">
                <div className="card-header" onClick={() => this.toggleExpand(c.name)}>{c.name}</div>
                {this.state.expanded[c.name] && <div className="card-body">{c.description}</div>}
            </div>)}
        </div>;
    }
}