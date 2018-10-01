var dcs = [
    { "level":  0, "Easy":  7, "Medium": 11, "Hard": 13, "Incredible": 14, "Ultimate": 16 },
    { "level":  1, "Easy":  8, "Medium": 13, "Hard": 15, "Incredible": 16, "Ultimate": 18 },
    { "level":  2, "Easy":  9, "Medium": 14, "Hard": 16, "Incredible": 17, "Ultimate": 19 },
    { "level":  3, "Easy": 10, "Medium": 15, "Hard": 17, "Incredible": 19, "Ultimate": 20 },
    { "level":  4, "Easy": 11, "Medium": 16, "Hard": 18, "Incredible": 20, "Ultimate": 21 },
    { "level":  5, "Easy": 12, "Medium": 18, "Hard": 20, "Incredible": 22, "Ultimate": 23 },
    { "level":  6, "Easy": 13, "Medium": 19, "Hard": 21, "Incredible": 23, "Ultimate": 25 },
    { "level":  7, "Easy": 14, "Medium": 21, "Hard": 22, "Incredible": 26, "Ultimate": 27 },
    { "level":  8, "Easy": 15, "Medium": 22, "Hard": 24, "Incredible": 27, "Ultimate": 28 },
    { "level":  9, "Easy": 16, "Medium": 23, "Hard": 26, "Incredible": 29, "Ultimate": 30 },
    { "level": 10, "Easy": 17, "Medium": 24, "Hard": 27, "Incredible": 31, "Ultimate": 32 },
    { "level": 11, "Easy": 18, "Medium": 25, "Hard": 28, "Incredible": 32, "Ultimate": 33 },
    { "level": 12, "Easy": 19, "Medium": 26, "Hard": 30, "Incredible": 33, "Ultimate": 34 },
    { "level": 13, "Easy": 20, "Medium": 28, "Hard": 32, "Incredible": 35, "Ultimate": 36 },
    { "level": 14, "Easy": 21, "Medium": 29, "Hard": 33, "Incredible": 36, "Ultimate": 38 },
    { "level": 15, "Easy": 22, "Medium": 30, "Hard": 35, "Incredible": 37, "Ultimate": 40 },
    { "level": 16, "Easy": 23, "Medium": 32, "Hard": 36, "Incredible": 38, "Ultimate": 41 },
    { "level": 17, "Easy": 24, "Medium": 33, "Hard": 38, "Incredible": 40, "Ultimate": 43 },
    { "level": 18, "Easy": 25, "Medium": 34, "Hard": 39, "Incredible": 41, "Ultimate": 44 },
    { "level": 19, "Easy": 26, "Medium": 35, "Hard": 40, "Incredible": 42, "Ultimate": 45 },
    { "level": 20, "Easy": 27, "Medium": 36, "Hard": 41, "Incredible": 43, "Ultimate": 47 },
    { "level": 21, "Easy": 28, "Medium": 38, "Hard": 45, "Incredible": 45, "Ultimate": 49 },
    { "level": 22, "Easy": 29, "Medium": 39, "Hard": 47, "Incredible": 47, "Ultimate": 51 },
    { "level": 23, "Easy": 30, "Medium": 41, "Hard": 49, "Incredible": 49, "Ultimate": 53 }
];
import React from 'react';

var difficulties = ["Easy", "Medium", "Hard", "Incredible", "Ultimate"];
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