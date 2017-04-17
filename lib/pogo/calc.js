const levelData = require('../../config/static/cp'),
    pokemonData = require('../../config/static/pokemon'),
    moveData = require('../../config/static/moves'),
    unobData = require('../../config/static/unob');

module.exports.getLevel = getLevel;
module.exports.getPokeName = getPokeName;
module.exports.getMoveName = getMoveName;
module.exports.mergePokeData = mergePokeData;

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

function mergePokeData(d) {
    let v = [];
    pokemonData.forEach(function (p) {
        if (p.Id) {
            v.push(
                [
                    p.Id,
                    p.Name,
                    resolveDexEntry(p.Id, d)
                ]);
        }
    });
    return v;
}

function resolveDexEntry(id, dex) {
    // get the special value for unobtainable pokemons
    let u = unobData.find(y => y.Id === id);
    // get whether it's in the current pokedex or not
    let i = dex.find(x => x.pokemon_id === id);

    if (u) {
        return u.Unobtainium;
    } else if (i) {
        return i.times_captured > 0 ? 'Y' : 'N';
    } else {
        return 'N';
    }
}