const inquirer = require('inquirer'),
    config = require('../../config/private/pokemongo.json');

module.exports.getUserCredentials = getUserCredentialsAsync;

function getUserCredentialsAsync() {
    if (config.username && config.password && config.hashkey) {
        return new Promise(function (resolve, reject) {
            resolve(config);
        });
    } else {
        return promptForCredentials();
    }
}

function promptForCredentials() {
    var questions = [{
        name: 'username',
        type: 'input',
        message: 'Enter your Google username or e-mail address:',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter your username or e-mail address';
            }
        }
    },
    {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter your password';
            }
        }
    },
    {
        name: 'hashkey',
        type: 'input',
        message: 'Enter your hashing key:',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter your hashing key';
            }
        }
    }
    ];

    return inquirer.prompt(questions);
}