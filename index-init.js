const
    welcome = require('./lib/welcome'),
    auth = require('./lib/google/auth'),
    gsheets = require('./lib/google/sheet'),
    write = require('./lib/write');

welcome.welcome();

auth.authenticate()
    .then(gsheets.initSheets)
    .then(write.writeSheetsConfig)
    .catch(console.err);