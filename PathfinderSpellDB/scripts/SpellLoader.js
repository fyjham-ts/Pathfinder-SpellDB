export function loadSpellData() {
    var fs = require('fs');
    const { remote } = require('electron');
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
    var list, powerType, powerOption;
    for (var s in rawSpells) {
        var spell = rawSpells[s];
        spell.powers = [];
        for (list in spellLists) {
            if (spellLists[list].indexOf(s) != -1) spell.powers.push({ 'powerType': 'traditions', 'powerOption': list });
        }
        for (powerType in spellPowers) {
            for (powerOption in spellPowers[powerType]) {
                if (spellPowers[powerType][powerOption].indexOf(s) != -1)
                    spell.powers.push({ 'powerType': powerType, 'powerOption': powerOption });
            }
        }
        spells.push(spell);
    }
    powerTypes.push("traditions");
    powerOptions.traditions = [];
    for (list in spellLists) powerOptions.traditions.push(list);
    for (powerType in spellPowers) {
        powerTypes.push(powerType);
        powerOptions[powerType] = [];
        for (powerOption in spellPowers[powerType]) {
            powerOptions[powerType].push(powerOption);
        }
    }
    return { spells, powerTypes, powerOptions };
};