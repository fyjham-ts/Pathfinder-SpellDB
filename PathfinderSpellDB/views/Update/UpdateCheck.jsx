'use babel';

import React from 'react';
import ProgressBar from '../../views/ProgressBar.jsx'
import UpdateDetails from '../../views/Update/UpdateDetails.jsx'
import { ipcRenderer } from 'electron';


export default class UpdateCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'current': null,
            "latest": null,
            "downloadStarted": false,
            "downloadComplete": false,
            "autoRestart": false
        };
        this.ipcRenderer = require('electron').ipcRenderer;
        this.registerIpcEvents();
        this.onStartDownload = this.onStartDownload.bind(this);
    }
    onStartDownload(autoRestart) {
        var self = this;

        if (autoRestart) ipcRenderer.emit("start-download-restart");
        else ipcRenderer.emit("start-download");
        this.setState({
            downloadStarted: true,
            autoRestart: autoRestart
        });
    }
    registerIpcEvents() {
        var self = this;
        this.ipcRenderer.on('version', function (event, version) {
            self.setState({ "current": { 'version': version } });
        });
        this.ipcRenderer.on('version', function (event, version) {
            self.setState({ "current": { 'version': version } });
        });
        this.ipcRenderer.on('update-info', function (event, updateDetails) {
            self.setState({ "latest": updateDetails });
        });
        this.ipcRenderer.on('update-error', function (event, updateDetails) {
            self.setState({ "latest": { "ERROR": updateDetails } });
        });
        this.ipcRenderer.on('update-downloaded', function (event, updateDetails) {
            self.setState({ "downloadComplete": true });
        }); 
    }
    render() {
        var details = null;
        return (
            <div>
                <h1>Version Information</h1>
                {(() => {
                    if (this.state.latest && this.state.current)
                        return <UpdateDetails
                            current={this.state.current}
                            latest={this.state.latest}
                            downloadStarted={this.state.downloadStarted}
                            downloadComplete={this.state.downloadComplete}
                            autoRestart={this.state.autoRestart}
                            onStartDownload={this.onStartDownload}

                            />;
                    else
                        return <ProgressBar label="Checking for updates..." />;

                })()}
            </div>
        )
    }
};  