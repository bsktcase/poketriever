const inquirer = require('inquirer');

module.exports.checkLocation = checkLocation;

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
}