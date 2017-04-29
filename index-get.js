const
    welcome = require('./lib/welcome'),
    loc = require('./lib/loc'),
    cred = require('./lib/cred'),
    inv = require('./lib/pogo/inv'),
    write = require('./lib/write');

welcome.welcome();

Promise.all([
    cred.getUserCredentials(),
    loc.getLocation()
])
    .then(result => {
        let credentials = result[0],
            location = result[1];
        return inv.doTheThing(credentials, location);
    })
    .then(write.writeInventory)
    .catch(console.error);