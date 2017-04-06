const fs = require('fs');

// select the desired json object and eventually convert it into an array of arrays

let inv = JSON.parse(fs.readFileSync('inventory.json', 'utf8'));




let rawPokemon = inv.pokemon;

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



class Pokemon {
    constructor(
		pokedex_number,
		name,
		species,
		attack_iv,
		defense_iv,
		stamina_iv,
		current_hp,
		max_hp,
		iv_percentage,
		cp,
		candy,
		favorite,
		family_name,
		id,
		move_1,
		move_2,
		caught_time,
		level
	)
	{
        this.pokedex_number = pokedex_number;
        this.name = name;
        this.species = species;
        this.attack_iv = attack_iv;
        this.defense_iv = defense_iv;
        this.stamina_iv = stamina_iv;
        this.current_hp = current_hp;
        this.max_hp = max_hp;
        this.iv_percentage = iv_percentage;
        this.cp = cp;
        this.candy = candy;
        this.favorite = favorite;
        this.family_name = family_name;
        this.id = id;
        this.move_1 = move_1;
        this.move_2 = move_2;
        this.caught_time = caught_time;
        this.level = level;
    }
}

module.exports = Pokemon;