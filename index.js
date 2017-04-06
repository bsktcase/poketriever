#! /usr/bin/env node

'use strict';
const program = require('commander');

program
.version('0.0.1')
.command('inv','Get inventory')
.command('sheet','Write an existing inventory file to a Google Sheet')
.parse(process.argv);