import { getRandomNpc } from '../../scripts/RandomGenLoader.js';
import React from 'react';

import AlignmentGrid from './AlignmentGrid.jsx';
import NpcCard from './NpcCard.jsx';

export default class RandomNpc extends React.PureComponent {
    constructor(props) {
        super(props);
        this.generateNpc = this.generateNpc.bind(this);
        this.state = {
            "npc": null
        };
        this.generateNpc();
    }
    generateNpc() {
        getRandomNpc().then(r => {
            console.log(r);
            this.setState({ "npc": r });
        });
    }
    render() {
        if (!this.state.npc)
            return <div>Loading...</div>;
        else {
            var npc = this.state.npc;
            var toFeet = (n) => {
                var realFeet = n * 0.393700 / 12;
                var feet = Math.floor(realFeet);
                var inches = Math.floor((realFeet - feet) * 12);
                return feet + "'" + inches + '\"';
            };
            var abilityNames = {
                str: "Strength",
                dex: "Dexterity",
                con: "Constitution",
                int: "Intellect",
                wis: "Wisdom",
                cha: "Charisma"
            };
            var majP = npc.description.pronounCapit;
            var minP = npc.description.pronounMinus;
            var quirksArray = npc.pquirks.description.split(".");
            quirksArray.length--;

            var specialPhysical1 = "";
            if (npc.physical.special1 != "") {
                specialPhysical1 = <p>{npc.physical.special1}</p>;
            }
            var specialPhysical2 = "";
            if (npc.physical.special2 != "") {
                specialPhysical2 = <p>{npc.physical.special2}</p>;
            }

            return <div className="container-fluid randomNpc">
                <div className="row">
                    <div className="col-md">
                        <NpcCard heading="Description" showRefresh="true" onRefresh={this.generateNpc}>
                            <p>
                                {npc.description.name} is a {npc.description.age + " "}
                                year old {npc.description.gender} {npc.description.race + " "}
                                {npc.description.occupation}.
                            </p>
                            <p>
                                {majP}has {npc.physical.hair}{npc.physical.eyes}.
                            </p>
                            <p>
                                {majP}has {npc.physical.skin}.
                            </p>
                            <p>
                                {majP}stands {npc.physical.height}cm ({toFeet(npc.physical.height)}) tall and has {npc.physical.build}.
                            </p>
                            <p>
                                {majP}has {npc.physical.face}.
                                </p>
                            {specialPhysical1}
                            {specialPhysical2}
                        </NpcCard>
                    </div>
                    <div className="col-md">
                        <NpcCard heading="Personality Traits">
                            <p>
                                {npc.religion.description}
                            </p>
                            <p>{npc.ptraits.traits1}</p>
                            <p>{npc.ptraits.traits2}</p>
                            {quirksArray.map((q, idx) => <p key={idx}>{q.trim()}.</p>)}
                            <p><strong>Hook: </strong>{npc.hook.description}</p>
                        </NpcCard>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <NpcCard heading="Ability Score">
                            <table className="abilityTable table table-sm">
                                <tbody>
                                    {Object.keys(npc.abilities).map((ability) => <tr key={ability}>
                                        <th>{abilityNames[ability]}</th><td>{npc.abilities[ability]}</td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </NpcCard>
                    </div>
                    <div className="col-sm">
                        <NpcCard heading="Relationships">
                            <p><b>Sexual Orientation </b></p><p hidden>- </p><p>{npc.relationship.orientation}</p>
                            <p><b>Relationship Status </b></p><p hidden>- </p><p>{npc.relationship.status}</p>
                        </NpcCard>
                    </div>
                    <div className="col-md">
                        <NpcCard heading="Alignment">
                            <AlignmentGrid alignment={npc.alignment} />
                        </NpcCard>
                    </div>
                </div>
            </div>;
        }
    }
}