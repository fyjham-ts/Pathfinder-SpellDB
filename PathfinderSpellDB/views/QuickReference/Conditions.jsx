﻿var conditions = [
    { "name": "Accelerated", "description": "One type of movement Speed is increased by a given distance per action. All types increase if the movement type is unspecified." },
    { "name": "Asleep", "description": "Can’t act. Gain the Blinded and Flat-footed conditions. Take a -4 conditional penalty to Armor Class (AC) and Perception. Critically fail all Reflex saves. Can’t remained seated or standing. Drop any held or wielded items unless an effect says otherwise. Awaken if you take damage, or an ally nudges or shakes you. If a loud noise is around you, you can attempt a Perception check as a free action at the start of your turn with a -4 circumstance penalty - unless magic explicitly prevents you such an attempt. On success, you awaken." },
    { "name": "Blinded", "description": "Treat all terrain as difficult. All other creatures and objects are Unseen to you unless you succeed at a Seek action to sense them. Automatically fail or critically fail (whichever is worse) Perception checks that fully depend on sight. If vision is your only precise sense, take a –4 conditional penalty to Perception checks. You’re immune to visual effects. Blinded overrides dazzled." },
    { "name": "Bolstered", "description": "You’ve been the subject of a spell or ability that can’t affect a creature more than once a day. Hence you’re immune to that same spell or ability from the same source for 24 hours, unless otherwise specified." },
    { "name": "Broken", "description": "The object can’t be used for its normal function or grant bonuses. It can still impose any item penalties or limitations as normal (if any). Broken armor is an exception insofar as it still grants item bonuses but also has a conditional penalty to AC", "description": "-1 for light armor, -2 for medium, or -3 for heavy." },
    { "name": "Concealed", "description": "Difficult to see but not invisible. A creature you’re concealed from must succeed at a DC 5 flat check when making an attack against you or targeting you with a spell or effect. On failure, the attack, spell, or effect has no effect." },
    { "name": "Confused", "description": "You can’t use reactions nor Delay or Ready an action. On each of your turns, you must use your actions to attack the creature that attacked you most recently. A GM may allow you to take actions needed to attempt this attack, such as drawing a weapon or moving. If no creature attacked you since your last turn, roll 1d4. On 1, attack nearest creature. On 2, attack yourself once (hitting automatically for normal damage) and end your turn. On 3, babble gibberish. On 4, act normally." },
    { "name": "Dazzled", "description": "If vision is your only precise sense, all creatures and objects have the Concealed condition." },
    { "name": "Deafened", "description": "You automatically fail or critically fail (whichever is worse) Perception checks based on sound. You take a -2 conditional penalty to Perception checks for initiative and those that involve sound but also rely on other senses. You must succeed at a DC 5 flat check to do any action with sound involved; on failure, the action is lost. You’re immune to auditory (hearing-based) effects." },
    { "name": "Drained", "description": "You take a conditional penalty equal to the value of this condition on any Fortitude saves and Constitution-based checks. Lose Hit Points equal to your level multiplied by this conditions’ value. Your maximum Hit Points drop by the same total. This condition’s value drops by 1 and your maximum Hit Points rise by 1 for each day you regain Hit Points by resting." },
    { "name": "Encumbered", "description": "Decrease every type of movement Speed by 10 feet (to no lower than 5 feet). Raise armor check penalty by 2 or take a -2 armor check penalty if unarmored." },
    { "name": "Enervated", "description": "Take a conditional penalty equal to this conditions’ value on checks that include a proficiency modifier. This penalty cannot exceed your level. Treat your level as if lowered by this conditions’ value when determining which spells you can cast or abilities you can use. You can attempt a Fortitude save daily to drop this condition’s value by 1 (or 2 on critical success). A day of downtime training can drop this condition’s value by 1 automatically." },
    { "name": "Enfeebled", "description": "Take a conditional penalty equal to this conditions’ value on attack and damage rolls as well as Strength-based checks." },
    { "name": "Entangled", "description": "Gain the Hampered 10 condition. You must succeed at a DC 5 flat check to not lose any attempt at a manipulate action, activity, free action, or reaction." },
    { "name": "Fascinated", "description": "Take a -2 conditional penalty to Perception and skill checks. You can’t concentrate except on the subject of your fascination. This condition ends at hostile acts toward you or allies." },
    { "name": "Fatigued", "description": "Gain the Hampered 5 condition. You take a -1 conditional penalty to AC and saves. Each action increases the penalty by 1 until the start of your next turn." },
    { "name": "Flat-footed", "description": "Take a -2 circumstance penalty to AC. (Flanking applies this condition.)" },
    { "name": "Fleeing", "description": "Spend all actions to flee this condition’s seeming source. You can’t Delay or Ready." },
    { "name": "Frightened", "description": "Take a conditional penalty equal to this conditions’ value on checks and saves. Unless specified, this condition’s value drops by 1 at the end of each of your turns." },
    { "name": "Grabbed", "description": "Gain the Flat-footed and Immobile conditions. You must succeed at a DC 5 flat check to not lose any attempt at a manipulate action, activity, free action, or reaction." },
    { "name": "Hampered", "description": "Decrease any specified type of movement Speed by this conditions’ value in feet (to no lower than 5 feet). If no type is specified, this affects all movement types." },
    { "name": "Immobile", "description": "You can’t use any action, activity, free action, or reaction with a move trait. If an outside force would move you, it must succeed at a check against the DC of the effect rooting you or the defense (usually Fortitude) of the creature rooting you." },
    { "name": "Paralyzed", "description": " Gain the Flat-footed condition. You can’t act except to Recall Knowledge or mentally." },
    { "name": "Persistent Damage", "description": "At turn’s end, take this condition’s value in damage. After that, you can attempt a DC 20 flat check to remove the persistent damage. You can take persistent damage from multiple sources, so long as they are of different damage types. See p. 323." },
    { "name": "Petrified", "description": "You can’t act. Gain the Blinded and Deafened conditions. You become an object with double your normal Bulk (usually 16 if Medium size or 8 if Small). Gain AC 9, TAC 5, Hardness 8. You can take  1 plus your Constitution modifier in damage in Dents before breaking. See p. 323." },
    { "name": "Prone", "description": "Take a -2 circumstance bonus penalty to attack rolls. Gain a +1 circumstance bonus to AC vs. ranged attacks. Flat-footed to melee attacks." },
    { "name": "Quick", "description": "Gain 1 extra action at the start of your turn each round. Source may specify action types." },
    { "name": "Restrained", "description": "Gain Immobile and Flat-footed conditions. You can’t do anything with attack or manipulate traits except for Break Grapple or Escape. Restrained overrides the Grabbed condition." },
    { "name": "Sensed", "description": "You become Sensed when a creature to whom you’re Unseen figures out what space you’re in. The creature is flat-footed to you but can target you with a Strike or other action that targets individuals, though it must succeed at a DC 11 flat check or it fails to affect you." },
    { "name": "Sick", "description": "Take a conditional penalty equal to this conditions’ value on all your checks. You can’t willingly ingest anything, even potions. Spending an action retching grants a Fortitude save vs the DC of the source of your sickness. Drop this conditions’ value by 1 (success) or 2 (critical success)." },
    { "name": "Slowed", "description": "Reduce the number of actions on your turn by the value of this condition. You can’t Ready an action. When you get this condition, you don’t have fewer actions until your next turn." },
    { "name": "Sluggish", "description": "Take a conditional penalty equal to this conditions’ value to AC, attack rolls, Dexterity-based checks, and Reflex saves." },
    { "name": "Stunned", "description": "Your body is unresponsive. You can’t act." },
    { "name": "Stupefied", "description": "Take a conditional penalty equal to this conditions’ value on spell rolls, spell DC, and mental checks (Intelligence, Wisdom, and Charisma). Any spell you cast is disrupted unless you succeed at a spell roll against the DC of this conditions’ source." },
    { "name": "Unseen", "description": "When unseen by a creature, it can’t see you at all, has no idea what space you occupy, is flat-footed to you, and can’t target you with attacks or targeted spells and effects, though area effects can affect you. A creature can use the Seek action to try to find you. On success, you’re Sensed." }
];
import React from 'react';

export default class Conditions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: {}
        };
        this.toggleExpand = this.toggleExpand.bind(this);
    }
    toggleExpand(conditionName) {
        var expanded = Object.assign({}, this.state.expanded);
        expanded[conditionName] = !expanded[conditionName];
        this.setState({ expanded: expanded });
    }
    render() {
        return <div className="conditions accordion">
            {conditions.map((c) => <div key={c.name} className="card">
                <div className="card-header" onClick={() => this.toggleExpand(c.name)}>{c.name}</div>
                {this.state.expanded[c.name] && <div className="card-body">{c.description}</div>}
            </div>)}
        </div>;
    }
}