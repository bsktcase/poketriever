const
    moment = require('moment'),
    inv = require('../../inventory.json'),
    calc = require('./calc');

module.exports.loadPokemon = loadPokemon;
module.exports.loadCandies = loadCandies;
module.exports.loadPokedex = loadPokedex;

function loadPokemon() {
    let pRows = [
        // ['#', 'pokémon', 'nick', 'tag', 'grade', iv', 'cp', 'level', 'atk', 'def', 'sta', 'quick move', 'charge move', 'date captured', 'max cp @ current level', 'max cp @ 40']
    ];

    let i = inv.pokemon.sort(function (a, b) {
        return b.creation_time_ms - a.creation_time_ms;
    });

    i.forEach(function (p) {
        if (p.is_egg == false) {
            pRows.push(
                [
                    p.pokemon_id,
                    calc.getPokeName(p.pokemon_id),
                    (calc.getPokeName(p.pokemon_id) === p.nickname ? '' : p.nickname),
                    null,
                    null,
                    null,
                    null,
                    calc.getLevel(p),
                    p.individual_attack,
                    p.individual_defense,
                    p.individual_stamina,
                    calc.getMoveName(p.move_1),
                    calc.getMoveName(p.move_2),
                    moment(p.creation_time_ms).format('YYYY-MM-DD HH:mm:ss.SSS'),
                    null,
                    null
                ]
            );
        }
    });

    // console.log('non-egg pokemon found: ' + (pRows.length - 1));
    // console.log(pRows);
    return pRows;
}

function loadCandies() {
    let cRows = [
        // ['#', 'candy', 'count']
    ];

    let i = inv.candies.sort(function (a, b) {
        return a.family_id - b.family_id;
    });

    i.forEach(function (c) {
        cRows.push(
            [
                c.family_id,
                calc.getPokeName(c.family_id),
                c.candy
            ]
        );
    });
    // console.log(cRows);
    return cRows;
}

function loadPokedex() {
    let dRows = [
        // ['#', 'pokémon', 'dex?']
    ];

    let i = calc.mergePokeData(inv.pokedex);
    
    dRows = i.sort(function (a, b) {
        return a[0] - b[0];
    });
    return dRows;
}

// json contents of interest
// pokemon
//     pokemon_id // the pokedex id
//     cp
//     move_1
//     move_2
//     individual_attack
//     individual_defense
//     individual_stamina
//     cp_multiplier
//     num_upgrades
//     additional_cp_multiplier
//     nickname
//     favorite
//     pokemon_display.gender
//     pokemon_display.shiny
//     creation_time_ms
// pokedex
//     pokemon_id
//     times_captured
//     captured_genders
//     captured_shiny
// player
//     level
//     pokemon_caught_by_type
// candies
//     family_id
//     candy