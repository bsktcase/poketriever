const levelData = require('../../config/static/cp'),
    pokemonData = require('../../config/static/pokemon'),
    moveData = require('../../config/static/moves');

module.exports.getLevel = getLevel;
module.exports.getPokeName = getPokeName;
module.exports.getMoveName = getMoveName;

function getLevel(pokemon) {
    let cp = pokemon.cp_multiplier;
    if (pokemon.hasOwnProperty('additional_cp_multiplier')) {
        cp += pokemon.additional_cp_multiplier;
    }

    for (let level in levelData.level_multipliers) {
        if (levelData.level_multipliers.hasOwnProperty(level) &&
            Math.abs(cp - levelData.level_multipliers[level]) < 0.0001) {
            return parseFloat(level);
        }
    }

    return 0;
}

function getPokeName(id) {
    let p = pokemonData.find(x => x.Id === id);
    return p.Name;
}

function getMoveName(id) {
    let m = moveData.find(x => x.Id === id);
    return m.Name;
}