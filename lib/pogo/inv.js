const pogobuf = require('pogobuf-vnext');

module.exports.doTheThing = doTheThing;

function doTheThing(credentials, location) {
    var client;
    // console.log(location.lat + ', ' + location.long);
    return new pogobuf.GoogleLogin().login(credentials.username, credentials.password)
        .then(token => {
            client = new pogobuf.Client({
                authType: 'google',
                authToken: token,
                version: 6100, // See http://pokehash.buddyauth.com/api/hash/versions to determine latest supported version
                useHashingServer: true,
                hashingServer: 'https://pokehash.buddyauth.com/', // SSL
                hashingKey: credentials.hashkey
            });
            client.setPosition(location.lat, location.long);
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