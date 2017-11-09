const pogobuf = require('pogobuf-vnext');

module.exports.doTheThing = doTheThing;

function doTheThing(credentials, location) {
    var client;
    // console.log('uname: ' + credentials.username + ' pwd: ' + credentials.password + ' hash: ' + credentials.hashkey);
    // console.log(location.lat + ', ' + location.long);
    return new pogobuf.GoogleLogin().login(credentials.username, credentials.password)
        .then(token => {
            client = new pogobuf.Client({
                authType: 'google',
                authToken: token,
                version: credentials.version,
                useHashingServer: true,
                hashingServer: credentials.hashserver,
                hashingKey: credentials.hashkey
            });
            client.setPosition(location.lat, location.long);
            // console.log('client: ' + client);
            return client.init();
        })
        .then(() => {
            // Get full inventory
            return client.getInventory(0);
        })
        .then(inventory => {
            if (!inventory.success) throw Error('success=false in inventory response');

            // Split inventory into individual arrays and log them on the console
            inventory = pogobuf.Utils.splitInventory(inventory);
            console.log('Full inventory:', 'trust me, it is in there');
            return inventory;
        })
        .catch(console.error);
}