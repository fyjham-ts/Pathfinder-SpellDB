export function loadSpellData() {
    var fs = require('fs');
    const { remote } = require('electron')
    var path = remote.app.getAppPath();
    // Raw data
    var rawSpells = JSON.parse(fs.readFileSync(path + '/data/spells.json', 'utf8'));
    var spellLists = JSON.parse(fs.readFileSync(path + '/data/by-list.json', 'utf8'));
    var spellPowers = JSON.parse(fs.readFileSync(path + '/data/by-power.json', 'utf8'));

    // Useful data
    var spells = [];
    var powerTypes = [];
    var powerOptions = {};

    // Mapping
    for (var s in rawSpells) {
        var spell = rawSpells[s];
        spell.powers = [];
        for (var list in spellLists) {
            if (spellLists[list].indexOf(s) != -1) spell.powers.push({ 'powerType': 'spell', 'powerOption': list });
        }
        for (var powerType in spellPowers) {
            for (var powerOption in spellPowers[powerType]) {
                if (spellPowers[powerType][powerOption].indexOf(s) != -1)
                    spell.powers.push({ 'powerType': powerType, 'powerOption': powerOption });
            }
        }
        spells.push(spell);
    }
    powerTypes.push("spell");
    powerOptions.spell = [];
    for (var list in spellLists) powerOptions.spell.push(list);
    for (var powerType in spellPowers) {
        powerTypes.push(powerType);
        powerOptions[powerType] = [];
        for (var powerOption in spellPowers[powerType]) {
            powerOptions[powerType].push(powerOption);
        }
    }
    return { spells, powerTypes, powerOptions };
};