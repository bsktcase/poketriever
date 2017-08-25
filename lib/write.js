const fs = require('fs');

module.exports.writeInventory = writeInventory;
// module.exports.writeSheetsConfig = writeSheetsConfig;

function writeInventory(inventory) {
    var stringInventory = JSON.stringify(inventory);
    return writeFileAsync('./config/private/inventory.json', stringInventory);
}

// function writeSheetsConfig(sheetDefinitions) {
//     var stringSheets = JSON.stringify(sheetDefinitions);
//     return writeMyFile('./config/private/sheetIds.json', stringSheets)
//         .then(console.log('The file was saved!'), console.error);
// }

function writeFileAsync(path, contents) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, contents, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('The file was saved!');
            resolve(data);
            return;
        });
    });
}