#! /usr/bin/env node

'use strict';
const program = require('commander');

program
    .version('0.0.1')
    .command('get', 'Get inventory')
    .command('init', 'Initialize Google Sheet for upload')
    .command('del', 'Delete the sheets')
    .command('up', 'Upload an existing inventory file to a Google Sheet')
    .parse(process.argv);