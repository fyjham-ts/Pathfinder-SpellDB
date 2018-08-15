'use babel';

import React from 'react';
import moment from 'moment';
import ProgressBar from "../../views/ProgressBar";

export default class UpdateDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.startDownload = this.startDownload.bind(this);
        this.startDownloadInstall = this.startDownloadInstall.bind(this);
    }
    startDownload() {
        this.props.onStartDownload(false);
    }
    startDownloadInstall() {
        this.props.onStartDownload(true);
    }
    render() {
        var isLatest = this.props.current.version == this.props.latest.version;
        return (
            <div className="upgradeDetails">
                <div className="grid">
                    <div className="row">
                        <div className="col"><label>Current Version</label></div>
                        <div className="col">{this.props.current.version}</div>
                    </div>
                    <div className="row">
                        <div className="col"><label>Latest Version</label></div>
                        <div className="col">{this.props.latest.version}</div>
                    </div>
                    {(() => {
                        if (isLatest) {
                            return <div className="alert alert-success">You are already on the latest version.</div>;
                        } else {
                            return <div className="row">
                                <div className="col">
                                    <button className="btn btn-primary" onClick={this.startDownload} disabled={this.props.downloadStarted}>Download</button>
                                </div>
                                <div className="col">
                                    <button className="btn btn-danger" onClick={this.startDownloadInstall} disabled={this.props.downloadStarted}>Install &amp; Restart</button><br />
                                </div>
                            </div>
                        }
                    })()}
                    {this.props.downloadStarted && !this.props.downloadCompleted && <div>
                        <ProgressBar label="Downloading update..." />
                        <i>You can close this window - the update will continue in the background</i>
                    </div>}
                    {this.props.downloadCompleted && <div className="alert alert-success">The new version has been downloaded. It will automatically install when you next restart.</div>}
                    <div className="row">
                        <div className="col"><label>Date Released</label></div>
                        <div className="col">{moment(this.props.latest.releaseDate).format('Do MMM YYYY')}</div>
                    </div>
                    <div><label>Release Notes</label></div>
                    <div style={{whiteSpace:"pre-wrap"}}>{this.props.latest.releaseNotes.replace(/<(?:.|\n)*?>/gm, '')}</div>
                </div>
            </div>
        )
    }
};  