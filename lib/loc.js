const inquirer = require('inquirer');

module.exports.checkLocation = (callback) => {
    var questions = [{
        name: 'home',
        type: 'confirm',
        message: 'Are you at home?',
    }];

    inquirer.prompt(questions).then(callback);
};