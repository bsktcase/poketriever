#! /usr/bin/env node

'use strict';
const chalk = require('chalk'),
    clear = require('clear'),
    figlet = require('figlet'),
    loc = require('./lib/loc'),
    cred = require('./lib/cred'),
    inv = require('./lib/inv'),
    write = require('./lib/write');

welcome();
loc.checkLocation();

cred.getUserCredentials()
    .then(inv.doTheThing)
    .then(write.writeInventory)
    .catch(console.error);

function welcome() {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync('Pokétriever', {
                horizontalLayout: 'full'
            })
        )
    );
}