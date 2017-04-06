const chalk = require('chalk'),
    clear = require('clear'),
    figlet = require('figlet');

module.exports.welcome = welcome;

function welcome() {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync('Pokétriever', {
                horizontalLayout: 'full'
            })
        )
    );
}