'use babel';

import React from 'react';
export default class SpellDetail extends React.PureComponent {
    render() {
        var spell = this.props.spell;
        var casting = spell.casting.map((c) => {
            var r = {
                'icon': null,
                'text': c
            }
            if (r.text) {
                switch (r.text[0]) {
                    case 'f':
                        r.icon = <img src="./images/icons/free.png" />
                        r.text = r.text.substring(1);
                        break;
                    case 'a':
                        r.icon = <img src="./images/icons/action.png" />;
                        r.text = r.text.substring(1);
                        break;
                    case 'r':
                        r.icon = <img src="./images/icons/reaction.png" />;
                        r.text = r.text.substring(1);
                        break;
                }
            }

            if (r.text) {
                switch (r.text) {
                    case "S": r.text = "Somatic"; break;
                    case "V": r.text = "Verbal"; break;
                    case "M": r.text = "Material"; break;
                }
            }

            return r;
        });
        var headerTokens = [];
        headerTokens.push({
            'title': 'Casting',
            'value': casting.map((c, index) => { return <span className="castingToken" key={index}>{c.icon}{c.text}</span>; })
        });
        if (spell['casting-time']) headerTokens.push({ 'title': 'Casting Time', 'value': spell['casting-time'] });
        if (spell.trigger) headerTokens.push({ 'title': 'Trigger', 'value': spell.trigger });
        if (spell.range) headerTokens.push({ 'title': 'Range', 'value': spell.range });
        if (spell.area) headerTokens.push({ 'title': 'Area', 'value': spell.area });
        if (spell.targets) headerTokens.push({ 'title': 'Targets', 'value': spell.targets });
        if (spell.duration) headerTokens.push({ 'title': 'Duration', 'value': spell.duration });
        if (spell.cost) headerTokens.push({ 'title': 'Cost', 'value': spell.cost });
        if (spell.target) headerTokens.push({ 'title': 'Target', 'value': spell.target });

        var bodySections = [];
        bodySections.push({ 'title': null, className: 'mainText', 'text': spell.description.main.replace(/ [-•] /g, '<br/> - ') });
        if (spell.description.subsections) {
            for (var section in spell.description.subsections) {
                var sectionTitle;
                var sectionClass;
                switch (section) {
                    case 'success': sectionTitle = 'Success'; sectionClass = 'save'; break;
                    case 'crit': sectionTitle = 'Critical Success'; sectionClass = 'save'; break;
                    case 'failure': sectionTitle = 'Failure'; sectionClass = 'save';break;
                    case 'crit-fail': sectionTitle = 'Critical Failure'; sectionClass = 'save';break;
                    default: sectionTitle = section; sectionClass = 'option'; break;
                }

                bodySections.push({
                    "title": <strong>{sectionTitle}</strong>,
                    "className": sectionClass,
                    "text": spell.description.subsections[section]
                });
            }
        }
        for (var level in spell.heightened) {
            bodySections.push({'title': <strong>Heightened({level})</strong>, 'className': 'heighten', 'text': spell.heightened[level] });
        }

        return (
            <div className="spellDetail clearfix">
                <div className="title">
                    <span className="spellClass">{spell.type}<span className={spell.type.toLowerCase() + " level"}>{spell.level}</span></span>
                    {spell.name}
                </div>
                <ul className="traits">
                    {spell.traits.map((t, index) => {
                        return <li key={index}>{t}</li>
                    })}
                </ul>
                <div className="header">
                    {headerTokens.map((t) => {
                        return <span key={t.title} className="headerElement"><strong>{t.title}:</strong> {t.value}</span>
                    })}
                </div>
                <div className="body">
                    {bodySections.map((s, index) => {
                        return <p key={index} className={s.className}>{s.title}<span dangerouslySetInnerHTML={{ __html: s.text }} /></p>
                    })}
                </div>
            </div>
        )
    }
};