const lvl = require('../config/static/cp');

function getLevel(pokemon) {
    return new Promise(function (resolve, reject) {
        let cp = pokemon.cp_multiplier;
        if (pokemon.hasOwnProperty('additional_cp_multiplier')) {
            cp += pokemon.additional_cp_multiplier;
        }

        for (let level in lvl.level_multiplier) {
            if (lvl.level_multiplier.hasOwnProperty(level) &&
                Math.abs(cp - lvl.level_multiplier[level]) < 0.0001) {
                resolve(parseFloat(level));
            }
        }

        resolve(0);
    });
}