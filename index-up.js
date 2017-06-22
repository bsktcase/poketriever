const
    welcome = require('./lib/welcome'),
    auth = require('./lib/google/auth'),
    gsheets = require('./lib/google/sheet');

welcome.welcome();

auth.authenticate()
    .then(gsheets.clearSheets)
    // .then(gsheets.deleteRows)
    .then(gsheets.doTheThing)
    .then(gsheets.updateFormulae)
    .catch(console.err);