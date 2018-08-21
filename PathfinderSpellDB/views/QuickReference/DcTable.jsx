'use babel';
var dcs = [
    { "level": 0, "Trivial": 9, "Low": 10, "High": 12, "Severe": 14, "Extreme": 17 },
    { "level": 1, "Trivial": 10, "Low": 12, "High": 14, "Severe": 15, "Extreme": 18 },
    { "level": 2, "Trivial": 11, "Low": 13, "High": 15, "Severe": 16, "Extreme": 19 },
    { "level": 3, "Trivial": 12, "Low": 15, "High": 17, "Severe": 18, "Extreme": 21 },
    { "level": 4, "Trivial": 13, "Low": 17, "High": 19, "Severe": 20, "Extreme": 23 },
    { "level": 5, "Trivial": 14, "Low": 18, "High": 21, "Severe": 22, "Extreme": 25 },
    { "level": 6, "Trivial": 15, "Low": 19, "High": 22, "Severe": 23, "Extreme": 26 },
    { "level": 7, "Trivial": 16, "Low": 20, "High": 23, "Severe": 24, "Extreme": 27 },
    { "level": 8, "Trivial": 17, "Low": 21, "High": 24, "Severe": 26, "Extreme": 29 },
    { "level": 9, "Trivial": 18, "Low": 23, "High": 26, "Severe": 27, "Extreme": 30 },
    { "level": 10, "Trivial": 19, "Low": 24, "High": 27, "Severe": 29, "Extreme": 32 },
    { "level": 11, "Trivial": 20, "Low": 25, "High": 28, "Severe": 30, "Extreme": 33 },
    { "level": 12, "Trivial": 21, "Low": 27, "High": 30, "Severe": 32, "Extreme": 35 },
    { "level": 13, "Trivial": 22, "Low": 29, "High": 32, "Severe": 35, "Extreme": 38 },
    { "level": 14, "Trivial": 23, "Low": 30, "High": 33, "Severe": 36, "Extreme": 39 },
    { "level": 15, "Trivial": 24, "Low": 32, "High": 35, "Severe": 37, "Extreme": 40 },
    { "level": 16, "Trivial": 25, "Low": 33, "High": 36, "Severe": 39, "Extreme": 42 },
    { "level": 17, "Trivial": 26, "Low": 35, "High": 38, "Severe": 40, "Extreme": 43 },
    { "level": 18, "Trivial": 27, "Low": 36, "High": 39, "Severe": 41, "Extreme": 44 },
    { "level": 19, "Trivial": 28, "Low": 37, "High": 40, "Severe": 42, "Extreme": 45 },
    { "level": 20, "Trivial": 29, "Low": 38, "High": 41, "Severe": 44, "Extreme": 47 },
    { "level": 21, "Trivial": 32, "Low": 42, "High": 45, "Severe": 47, "Extreme": 50 },
    { "level": 22, "Trivial": 34, "Low": 44, "High": 47, "Severe": 49, "Extreme": 52 },
    { "level": 23, "Trivial": 36, "Low": 46, "High": 49, "Severe": 51, "Extreme": 54 }
];
import React from 'react';

var difficulties = ["Trivial", "Low", "High", "Severe", "Extreme"];
export default class DcTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.clickRow = this.clickRow.bind(this);
        this.state = {
            selectedLevel: null
        };
    }
    clickRow(lvl) {
        if (this.state.selectedLevel == lvl) {
            this.setState({ "selectedLevel": null });
        } else {
            this.setState({ "selectedLevel": lvl });
        }
    }
    render() {
        return <table className="dcTable">
            <thead><tr><th className="level">Level</th>{difficulties.map(d => <th key={d}>{d}</th>)}</tr></thead>
            <tbody>
                {dcs.map(lvl => <tr key={lvl.level} onClick={() => this.clickRow(lvl)} className={lvl == this.state.selectedLevel ? "selected" : ""}>
                    <th className="level">{lvl.level}</th>
                    {difficulties.map(d => <td key={d}>{lvl[d]}</td>)}
                </tr>)}
            </tbody>
        </table>;
    }
}