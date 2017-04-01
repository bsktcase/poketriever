const pogobuf = require('pogobuf');

// Note: To avoid getting softbanned, change these coordinates to something close to where you
// last used your account
const lat = 47.4993055,
    lng = -122.3658217;

let client;

module.exports.doTheThing = (credentials, callback) => {
    new pogobuf.GoogleLogin().login(credentials.username, credentials.password)
        .then(token => {
            client = new pogobuf.Client({
                authType: 'google',
                authToken: token,
                version: 5702, // Use API version 0.57.2 (minimum version for hashing server is 5100)
                useHashingServer: true,
                hashingServer: 'https://pokehash.buddyauth.com/', // SSL
                hashingKey: credentials.hashkey
            });
            client.setPosition(lat, lng);
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
            callback(inventory);
        })
        .catch(console.error);
};