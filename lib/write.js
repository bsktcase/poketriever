const fs = require('fs');

module.exports.writeInventory = writeInventory;
module.exports.writeSheetsConfig = writeSheetsConfig;

function writeInventory(inventory) {
    var stringInventory = JSON.stringify(inventory);
    return writeMyFile('inventory.json', stringInventory)
        .then(console.log('The file was saved!'), console.error);
}

function writeSheetsConfig(sheetDefinitions) {
    var stringSheets = JSON.stringify(sheetDefinitions);
    return writeMyFile('./config/private/sheetIds.json', stringSheets)
        .then(console.log('The file was saved!'), console.error);
}

function writeMyFile(path, contents) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, contents, function (err, data) {
            if (err) return reject(err);
            resolve(data);
        });
    });
}