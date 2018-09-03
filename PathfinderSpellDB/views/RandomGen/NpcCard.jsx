import React from 'react';

export default class NpcCard extends React.PureComponent {
    render() {
        return <div className="card npcCard">
            <div className="card-header">
                {this.props.heading}
                {this.props.showRefresh &&
                    <button className="btn btn-default" onClick={this.props.onRefresh}>
                        <i className="fas fa-sync" />
                    </button>
                }
            </div>
            <div className="card-body">
                {this.props.children}
            </div>
        </div>;
    }
}