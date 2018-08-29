import React from 'react';
export default class SpellListItem extends React.PureComponent {
    render() {
        var spell = this.props.spell;
        var onSelect = () => this.props.onSelect(spell);
        var css = "spell-list-item list-group-item list-group-item-action" + (this.props.selected ? " active" : "");
        var description = null;
        if (spell.powers.length > 0) {
            description = <span className="powerTypes">({spell.powers.map((p, index) => { return <span key={index}>{p.powerOption} {p.powerType}</span>; })})</span>;
        }
        return (
            <li className={css} onClick={onSelect}>
                <span className={spell.type.toLowerCase() + " level"}>{spell.level} </span>
                {spell.name.toLowerCase()} {description}
            </li>
        )
    }
};