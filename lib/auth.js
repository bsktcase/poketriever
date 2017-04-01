const inquirer = require('inquirer');

module.exports.getGoogleCredentials = (callback) => {
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

    inquirer.prompt(questions).then(callback);
};