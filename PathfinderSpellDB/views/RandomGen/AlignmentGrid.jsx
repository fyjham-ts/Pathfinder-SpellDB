import React from 'react';

export default class AlignmentGrid extends React.PureComponent {
    evaluateBackground(val) {
        return {
            backgroundColor: "rgba(0,150,255," + (val/100) +")"
        };
    }
    render() {
        var alignments = [
            this.props.alignment.lawful * this.props.alignment.good,
            this.props.alignment.ethicalneutral * this.props.alignment.good,
            this.props.alignment.chaotic * this.props.alignment.good,

            this.props.alignment.lawful * this.props.alignment.moralneutral,
            this.props.alignment.ethicalneutral * this.props.alignment.moralneutral,
            this.props.alignment.chaotic * this.props.alignment.moralneutral,

            this.props.alignment.lawful * this.props.alignment.evil,
            this.props.alignment.ethicalneutral * this.props.alignment.evil,
            this.props.alignment.chaotic * this.props.alignment.evil
        ];
        alignments.map(a => a * a);
        var maxAlign = Math.max(1, Math.max.apply(Math, alignments));

        alignments = alignments.map(v => Math.max(0, Math.floor(v * 100 / maxAlign)));

        return <div className="alignmentGrid">
            <div className="row">
                <div className="col" />
                <div className="col">L</div>
                <div className="col">N</div>
                <div className="col">C</div>
            </div>
            <div className="row">
                <div className="col">G</div>
                {[0, 1, 2].map(i => <div key={i} className="col" style={this.evaluateBackground(alignments[i])}>{alignments[i]}</div>)}
            </div>
            <div className="row">
                <div className="col">N</div>
                {[3, 4, 5].map(i => <div key={i} className="col" style={this.evaluateBackground(alignments[i])}>{alignments[i]}</div>)}
            </div>
            <div className="row">
                <div className="col">E</div>
                {[6, 7, 8].map(i => <div key={i} className="col" style={this.evaluateBackground(alignments[i])}>{alignments[i]}</div>)}
            </div>
        </div>;
    }
}