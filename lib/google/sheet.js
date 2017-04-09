const
    google = require('googleapis'),
    sheets = google.sheets('v4'),
    config = require('../../config/private/mygooglesheets'),
    sheetIds = require('../../config/private/sheetIds'),
    model = require('../pogo/model');

const
    inventoryName = 'pokélist',
    candiesName = 'candies',
    pokedexName = 'pokédex';

module.exports.initSheets = initSheets;
module.exports.captureSheetIds = captureSheetIds;
module.exports.doTheThing = doTheThing;
module.exports.deleteSheets = deleteSheets;

function doTheThing(auth) {
    let p = model.loadPokemon();
    let c = model.loadCandies();
    let d = model.loadPokedex();

    uploadSheet(auth, inventoryName, p);
    uploadSheet(auth, candiesName, c);
    uploadSheet(auth, pokedexName, d);
}

function uploadSheet(auth, sheetName, thing) {
    let mySpreadsheetId = config.testsheetid;
    var request = {
        auth: auth,
        spreadsheetId: mySpreadsheetId,
        range: sheetName + '!A1:A1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'OVERWRITE',
        resource: {
            values: thing
        }
    };

    sheets.spreadsheets.values.append(request, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }

        // TODO: Change code below to process the `response` object:
        // console.log(JSON.stringify(response, null, 2));
        console.log('appended ' + sheetName + ' data');
    });
}

function initSheets(auth) {
    return new Promise(function (resolve, reject) {
        let mySpreadsheetId = config.testsheetid;

        var request = {
            auth: auth,
            spreadsheetId: mySpreadsheetId,
            resource: {
                // A list of updates to apply to the spreadsheet.
                // Requests will be applied in the order they are specified.
                // If any request is not valid, no requests will be applied.
                requests: [{
                    'addSheet': {
                        'properties': {
                            'title': 'pokédex',
                            'gridProperties': {
                                'rowCount': 1,
                                'columnCount': 1
                            }
                        }
                    }
                }, {
                    'addSheet': {
                        'properties': {
                            'title': 'candies',
                            'gridProperties': {
                                'rowCount': 1,
                                'columnCount': 1
                            }
                        }
                    }
                }, {
                    'addSheet': {
                        'properties': {
                            'title': 'pokélist',
                            'gridProperties': {
                                'rowCount': 1,
                                'columnCount': 1
                            }
                        }
                    }
                }],
            }
        };

        resolve(doBatchUpdate(request)
            .then(captureSheetIds));
    });
}

function deleteSheets(auth) {
    return new Promise(function (resolve, reject) {
        let mySpreadsheetId = config.testsheetid;
        let thereAreSheets = false;

        var request = {
            auth: auth,
            spreadsheetId: mySpreadsheetId,
            resource: {
                // A list of updates to apply to the spreadsheet.
                // Requests will be applied in the order they are specified.
                // If any request is not valid, no requests will be applied.
                requests: [],
            }
        };

        sheetIds.forEach(function (s) {
            thereAreSheets = true;
            request.resource.requests.push({
                'deleteSheet': {
                    'sheetId': s.sheetId
                }
            });
        });
        if (thereAreSheets) {
            console.log('deleting ' + request.resource.requests.length + ' sheets');
            resolve(doBatchUpdate(request)
                .then(function () {
                    return [];
                }));
        }
    });
}

function doBatchUpdate(request) {
    return new Promise(function (resolve, reject) {
        sheets.spreadsheets.batchUpdate(request, function (err, response) {
            if (err) {
                console.log(err);
                reject(err);
            }

            // console.log(JSON.stringify(response, null, 2));
            resolve(response);
        });
    });
}

function captureSheetIds(response) {
    return new Promise(function (resolve, reject) {
        let sheetsConfig = [];
        if (response && response.replies && response.replies.length > 0) {
            response.replies.forEach(function (s) {
                // console.log('IM IN UR LOG');
                sheetsConfig.push({
                    'title': s.addSheet.properties.title,
                    'sheetId': s.addSheet.properties.sheetId
                });

            });
        }
        console.log(sheetsConfig);
        resolve(sheetsConfig);
    });
}