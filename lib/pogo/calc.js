const levelData = require('../../config/static/cp'),
    pokemonData = require('../../config/static/pokemon'),
    moveData = require('../../config/static/moves'),
    unobData = require('../../config/static/unob'),
    medalData = require('../../config/static/medals');

module.exports.getLevel = getLevel;
module.exports.getPokeName = getPokeName;
module.exports.getMoveName = getMoveName;
module.exports.mergePokeData = mergePokeData;
module.exports.mergeMedalData = mergeMedalData;

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
            let s = resolveDexEntry(p.Id, d);
            v.push(
                [
                    p.Id,
                    p.Name,
                    s.in_dex,
                    s.times_encountered,
                    s.times_captured
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
    let x = 'N';
    let e = 0;
    let c = 0;

    if (i) {
        x = i.times_captured > 0 ? 'Y' : 'N';
        e = i.times_encountered;
        c = i.times_captured;
    } else if (u) {
        x = u.Unobtainium;
    }

    return {
        in_dex: x,
        times_encountered: e,
        times_captured: c
    };
}

function mergeMedalData(player) {
    // "pokemon_caught_by_type": [0, 2125, 105, 1562, 1771, 577, 292, 770, 243, 108, 404, 1375, 786, 324, 501, 227, 39, 205, 358],
    // ?, normal, fighting, flying, poison, ground, rock, bug, ghost, steel, fire, water, grass, electric, psychic, ice, dragon, dark, fairy
    // poke_stop_visits; km_walked; evolutions; eggs_hatched; big_magikarp_caught; small_rattata_caught; 
    // num_berries_fed; total_defended_ms; num_raid_battle_won; battle_training_won; battle_attack_won
    let m = medalData;
    let t = player.pokemon_caught_by_type;

    t.forEach(function (value, i) {
        m.types[i] = value;
    });

    m.medals.medalacetrainer = player.battle_training_won;
    m.medals.medalbackpacker = player.poke_stop_visits;
    m.medals.medalbattlegirl = player.battle_attack_won;
    m.medals.medalberry = player.num_berries_fed;
    m.medals.medalbreeder = player.eggs_hatched;
    m.medals.medalchampion = player.num_raid_battle_won;
    m.medals.medalcollector = player.pokemons_captured;
    m.medals.medalfisherman = player.big_magikarp_caught;
    m.medals.medalgymleader = player.total_defended_ms;
    m.medals.medaljogger = player.km_walked;
    // m.medals.medaljohto = 0;
    // m.medals.medalkanto = 0;
    // m.medals.medalpikachu = 0;
    m.medals.medalscientist = player.evolutions;
    m.medals.medalyoungster = player.small_rattata_caught;

    return m;
}

function countByRegion() {
    return 0;
}