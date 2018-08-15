'use babel';

import React from 'react';

export default class Progressbar extends React.Component {
    render() {
        return (

            <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}>
                    {this.props.label}
                </div>
            </div>
        )
    }
};  