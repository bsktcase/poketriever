const inquirer = require('inquirer'),
    geolocation = require('windows.devices.geolocation');

module.exports.checkLocation = checkLocation;
module.exports.getLocation = getLocationAsync;

function getLocationAsync() {
    return new Promise(function (resolve, reject) {
        var locator = new geolocation.Geolocator();

        locator.getGeopositionAsync(function (err, res) {
            // result is of type geoposition
            if (err) {
                return reject(err);
            }

            resolve({
                lat: res.coordinate.latitude,
                long: res.coordinate.longitude
            });
            //console.info('(', res.coordinate.longitude, res.coordinate.latitude, ')');
        });
    });
}

function checkLocation() {
    return promptForHome()
        .then(exitIfNotHomeBecauseLatLong);
}

function promptForHome() {
    var questions = [{
        name: 'home',
        type: 'confirm',
        message: 'Are you at home?',
    }];

    return inquirer.prompt(questions);
}

function exitIfNotHomeBecauseLatLong(answers) {
    if (!answers.home) {
        console.log('You are not home - do not run without changing lat/long first');
        process.exit();
    }
    return answers;
}