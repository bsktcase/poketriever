const fs = require('fs');

module.exports.writeInventory = writeInventory;

function writeMyFile(path, contents) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, contents, function (err, data) {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

function writeInventory(inventory) {
    var stringInventory = JSON.stringify(inventory);
    return writeMyFile('inventory.json', stringInventory)
        .then(console.log('The file was saved!'), console.error);
}