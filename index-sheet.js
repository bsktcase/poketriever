const welcome = require('./lib/welcome'),
    auth = require('./lib/google/auth'),
    gsheets = require('./lib/google/sheet');

welcome.welcome();

// do stuff with the inventory

auth.authenticate()
    .then(gsheets.create)
    .then(gsheets.append);