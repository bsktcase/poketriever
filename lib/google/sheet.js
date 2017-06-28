const
    google = require('googleapis'),
    sheets = google.sheets('v4'),
    config = require('../../config/private/mygooglesheets'),
    mySpreadsheetId = config.realsheetid,
    sheetIds = require('../../config/private/sheetIds'),
    model = require('../pogo/model');

const formulae = require('../../config/static/formulae.json');

const
    inventoryName = 'pokélist',
    candiesName = 'candies',
    pokedexName = 'pokédex';

module.exports.clearSheets = clearSheets;
module.exports.deleteRows = deleteRows;
module.exports.doTheThing = doTheThing;
module.exports.updateFormulae = updateFormulae;

// function doTheThing(auth) {
//     let p = model.loadPokemon();
//     let c = model.loadCandies();
//     let d = model.loadPokedex();

//     uploadSheet(auth, inventoryName, p);
//     uploadSheet(auth, candiesName, c);
//     uploadSheet(auth, pokedexName, d);
// }

function doTheThing(auth) {
    return Promise.all(
        [
            uploadSheet(auth, inventoryName, model.loadPokemon()),
            uploadSheet(auth, candiesName, model.loadCandies()),
            uploadSheet(auth, pokedexName, model.loadPokedex())
        ])
        .then(result => {
            return result[0]; // they're all the same
        });
}

function uploadSheet(auth, sheetName, thing) {
    return new Promise((resolve, reject) => {
        var request = {
            auth: auth,
            spreadsheetId: mySpreadsheetId,
            range: sheetName + '!A2:IV',
            valueInputOption: 'RAW',
            insertDataOption: 'OVERWRITE',
            resource: {
                values: thing
            }
        };

        sheets.spreadsheets.values.append(request, function (err, response) {
            if (err) {
                console.log(err);
                reject(err);
            }

            // console.log(JSON.stringify(response, null, 2));
            console.log('appended ' + sheetName + ' data');
            resolve(auth);
        });
    });
}

function clearSheets(auth) {
    return new Promise(function (resolve, reject) {
        var request = {
            auth: auth,
            spreadsheetId: mySpreadsheetId,
            resource: {
                ranges: [
                    inventoryName + '!A2:IV',
                    candiesName + '!A2:IV',
                    pokedexName + '!A2:IV'
                ]
            },
        };

        sheets.spreadsheets.values.batchClear(request, function (err, response) {
            if (err) {
                console.log(err);
                reject(err);
            }

            // console.log(JSON.stringify(response, null, 2));
            console.log('cleared sheets');
            resolve(auth);
        });
    });
}

function deleteRows(auth) {
    return new Promise(function (resolve, reject) {
        let request = {
            auth: auth,
            spreadsheetId: mySpreadsheetId,
            resource: {
                // A list of updates to apply to the spreadsheet.
                // Requests will be applied in the order they are specified.
                // If any request is not valid, no requests will be applied.
                requests: []
            }
        };
        let sheetId = sheetIds.find(x => x.title === inventoryName).sheetId;

        request.resource.requests.push({
            deleteDimension: {
                range: {
                    sheetId: sheetId,
                    dimension: 'ROWS',
                    startIndex: 2
                }
            }
        });

        // console.log(request.resource.requests[0]);
        sheets.spreadsheets.batchUpdate(request, function (err, response) {
            if (err) {
                console.log(err);
                reject(err);
            }

            console.log('deleted empty rows');
            // console.log(JSON.stringify(response, null, 2));
            resolve(auth);
        });
    });
}

function updateFormulae(auth) {
    return new Promise(function (resolve, reject) {
        let request = {
            auth: auth,
            spreadsheetId: mySpreadsheetId,
            resource: {
                // A list of updates to apply to the spreadsheet.
                // Requests will be applied in the order they are specified.
                // If any request is not valid, no requests will be applied.
                requests: []
            }
        };
        let sheetId = sheetIds.find(x => x.title === inventoryName).sheetId;

        formulae.forEach(function (f) {
            // console.log(f);
            request.resource.requests.push({
                repeatCell: {
                    range: {
                        sheetId: sheetId,
                        startRowIndex: 1,
                        startColumnIndex: f.column,
                        endColumnIndex: f.column + 1
                    },
                    cell: {
                        userEnteredValue: {
                            formulaValue: f.formula
                        }
                    },
                    fields: 'userEnteredValue'
                }
            });
        });

        // console.log(request.resource.requests[0]);
        sheets.spreadsheets.batchUpdate(request, function (err, response) {
            if (err) {
                console.log(err);
                reject(err);
            }

            console.log('updated formulae');
            // console.log(JSON.stringify(response, null, 2));
            resolve(auth);
        });
    });
}