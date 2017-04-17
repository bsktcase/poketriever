const
    google = require('googleapis'),
    sheets = google.sheets('v4'),
    config = require('../../config/private/mygooglesheets'),
    mySpreadsheetId = config.realsheetid,
    sheetIds = require('../../config/private/sheetIds'),
    model = require('../pogo/model');

const
    inventoryName = 'pokélist',
    candiesName = 'candies',
    pokedexName = 'pokédex';

module.exports.doTheThing = doTheThing;
module.exports.clearSheets = clearSheets;
module.exports.updateFormulae = updateFormulae;

function doTheThing(auth) {
    let p = model.loadPokemon();
    let c = model.loadCandies();
    let d = model.loadPokedex();

    uploadSheet(auth, inventoryName, p);
    uploadSheet(auth, candiesName, c);
    uploadSheet(auth, pokedexName, d);
}

function uploadSheet(auth, sheetName, thing) {
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
            return;
        }

        // console.log(JSON.stringify(response, null, 2));
        console.log('appended ' + sheetName + ' data');
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

function updateFormulae(auth) {
    return new Promise(function (resolve, reject) {
        let request = {
            auth: auth,
            spreadsheetId: mySpreadsheetId,
            resource: {
                // A list of updates to apply to the spreadsheet.
                // Requests will be applied in the order they are specified.
                // If any request is not valid, no requests will be applied.
                requests: [],
            }
        };
        let sheetId = sheetIds.find(x => x.title === inventoryName).sheetId;

        request.resource.requests.push({
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    startColumnIndex: 3,
                    endColumnIndex: 4
                },
                cell: {
                    userEnteredValue: {
                        formulaValue: '=INDEX(grade,MATCH(1,($E2>=grademin)*($E2<=grademax),0),1)'
                    }
                },
                fields: 'userEnteredValue'
            }
        }, {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    startColumnIndex: 4,
                    endColumnIndex: 5
                },
                cell: {
                    userEnteredValue: {
                        formulaValue: '=($H2+$I2+$J2)/45'
                    }
                },
                fields: 'userEnteredValue'
            }
        }, {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    startColumnIndex: 5,
                    endColumnIndex: 6
                },
                cell: {
                    userEnteredValue: {
                        formulaValue: '=IFERROR(FLOOR((ARRAYFORMULA(INDEX(baseattack,MATCH($B2,pokename,0),1))+$H2)*(ARRAYFORMULA(INDEX(basedefense,MATCH($B2,pokename,0),1))+$I2)^0.5*(ARRAYFORMULA(INDEX(basestamina,MATCH($B2,pokename,0),1))+$J2)^0.5*ARRAYFORMULA(INDEX(cpmultiplier,MATCH($G2,levels,0),1))^2/10),"")'
                    }
                },
                fields: 'userEnteredValue'
            }
        }, {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    startColumnIndex: 13,
                    endColumnIndex: 14
                },
                cell: {
                    userEnteredValue: {
                        formulaValue: '=IFERROR(FLOOR((ARRAYFORMULA(INDEX(baseattack,MATCH($B2,pokename,0),1))+$H2)*(ARRAYFORMULA(INDEX(basedefense,MATCH($B2,pokename,0),1))+$I2)^0.5*(ARRAYFORMULA(INDEX(basestamina,MATCH($B2,pokename,0),1))+$J2)^0.5*ARRAYFORMULA(INDEX(cpmultiplier,MATCH(currentlevel+1.5,levels,0),1))^2/10),0)'
                    }
                },
                fields: 'userEnteredValue'
            }
        }, {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    startColumnIndex: 14,
                    endColumnIndex: 15
                },
                cell: {
                    userEnteredValue: {
                        formulaValue: '=IFERROR(FLOOR((ARRAYFORMULA(INDEX(baseattack,MATCH($B2,pokename,0),1))+$H2)*(ARRAYFORMULA(INDEX(basedefense,MATCH($B2,pokename,0),1))+$I2)^0.5*(ARRAYFORMULA(INDEX(basestamina,MATCH($B2,pokename,0),1))+$J2)^0.5*ARRAYFORMULA(INDEX(cpmultiplier,MATCH(40,levels,0),1))^2/10),0)'
                    }
                },
                fields: 'userEnteredValue'
            }
        });

        // console.log(request.resource.requests);
        sheets.spreadsheets.batchUpdate(request, function (err, response) {
            if (err) {
                console.log(err);
                reject(err);
            }

            console.log('Updated formulae');
            // console.log(JSON.stringify(response, null, 2));
            resolve(response);
        });
    });
}