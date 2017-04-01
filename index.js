#! /usr/bin/env node

'use strict';
const chalk = require('chalk'),
    clear = require('clear'),
    figlet = require('figlet'),
    config = require('./config/private.json'),
    loc = require('./lib/loc'),
    auth = require('./lib/auth'),
    inv = require('./lib/inv'),
    write = require('./lib/write');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Pokétriever', {
            horizontalLayout: 'full'
        })
    )
);

loc.checkLocation(function (answers) {
    if (!answers.home) {
        console.log('you are not home');
        process.exit();
    }
});

let params;
let fullInv;

if (config.username && config.password && config.hashkey) {
    params = config;
} else {
    auth.getGoogleCredentials(function (answers) {
        params = answers;
    });
}

inv.doTheThing(params, function (inventory) {
    fullInv = JSON.stringify(inventory);
    write.writeFileToDisk('inventory.txt', fullInv);
});