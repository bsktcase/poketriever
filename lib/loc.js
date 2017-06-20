const inquirer = require('inquirer'),
    geolocation = require('@nodert-win10/windows.devices.geolocation');
// config = require('../../config/private/pokemongo.json');

// Note: To avoid getting softbanned, change these coordinates to something close to where you
// last used your account
// const lat = config.home.lat,
//     lng = config.home.long;

module.exports.checkLocation = checkLocation;
module.exports.getLocation = getLocationAsync;

function getLocationAsync() {
    return new Promise(function (resolve, reject) {
        var locator = new geolocation.Geolocator();

        locator.getGeopositionAsync(function (err, res) {
            // result is of type geoposition
            if (err) {
                reject(err);
                return;
            }

            //console.info('(', res.coordinate.longitude, res.coordinate.latitude, ')');
            resolve({
                lat: res.coordinate.latitude,
                long: res.coordinate.longitude
            });
            return;
        });
    });
}

function checkLocation() {
    return new Promise((resolve, reject) => {
        let questions = [{
            name: 'home',
            type: 'confirm',
            message: 'Are you at home?',
        }];
        let answers = inquirer.prompt(questions);

        if (!answers.home) {
            reject('You are not home - do not run without changing lat/long first');
            return;
        }
        resolve(answers);
        return;
    });
}