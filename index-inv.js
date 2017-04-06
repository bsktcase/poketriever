const welcome = require('./lib/welcome'),
    loc = require('./lib/loc'),
    cred = require('./lib/cred'),
    inv = require('./lib/pogo/inv'),
    write = require('./lib/write');

welcome.welcome();
loc.checkLocation();

cred.getUserCredentials()
    .then(inv.doTheThing)
    .then(write.writeInventory)
    .catch(console.error);
