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
    buildIcons(actions) {
        if (actions) {
            return actions.split('').map(c => {
                switch (c) {
                    case 'f':
                        return <img src="../images/icons/Free.png" />;
                    case 'a':
                        return <img src="../images/icons/action.png" />;
                    case 'r':
                        return <img src="../images/icons/Reaction.png" />;
                }
            });
        }
    }
    render() {
        return <div className="quickRefList accordion">
            {this.props.list.map((c) => <div key={c.name} className="card">
                <div className="card-header" onClick={() => this.toggleExpand(c.name)}>{this.buildIcons(c.actions)}{c.name}</div>
                {this.state.expanded[c.name] &&
                    <div className="card-body">
                        {c.description}
                        {(c.subheadings || []).map(sh => <div className="card-subheading"><span className="card-subheading-title">{sh.title}</span>{sh.text}</div>)}
                    </div>
                }
            </div>)}
        </div>;
    }
}