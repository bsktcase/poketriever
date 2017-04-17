#! /usr/bin/env node

'use strict';
const program = require('commander');

program
    .version('0.0.1')
    .command('get', 'Get inventory')
    .command('up', 'Upload an existing inventory file to a Google Sheet')
    .command('form', 'Update the formulae')
    .parse(process.argv);