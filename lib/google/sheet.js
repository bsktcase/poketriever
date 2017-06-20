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
                        formulaValue: '=INDEX(gradetag,MATCH(1,($F2>=grademin)*($F2<=grademax),0),1)'
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
                        formulaValue: '=INDEX(grade,MATCH(1,($F2>=grademin)*($F2<grademax),0),1)'
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
                        formulaValue: '=($I2+$J2+$K2)/45'
                    }
                },
                fields: 'userEnteredValue'
            }
        }, {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    startColumnIndex: 6,
                    endColumnIndex: 7
                },
                cell: {
                    userEnteredValue: {
                        formulaValue: '=IFERROR(FLOOR((ARRAYFORMULA(INDEX(baseattack,MATCH($B2,pokename,0),1))+$I2)*(ARRAYFORMULA(INDEX(basedefense,MATCH($B2,pokename,0),1))+$J2)^0.5*(ARRAYFORMULA(INDEX(basestamina,MATCH($B2,pokename,0),1))+$K2)^0.5*ARRAYFORMULA(INDEX(cpmultiplier,MATCH($H2,levels,0),1))^2/10),"")'
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
                        formulaValue: '=IFERROR(FLOOR((ARRAYFORMULA(INDEX(baseattack,MATCH($B2,pokename,0),1))+$I2)*(ARRAYFORMULA(INDEX(basedefense,MATCH($B2,pokename,0),1))+$J2)^0.5*(ARRAYFORMULA(INDEX(basestamina,MATCH($B2,pokename,0),1))+$K2)^0.5*ARRAYFORMULA(INDEX(cpmultiplier,MATCH(currentlevel+1.5,levels,0),1))^2/10),0)'
                    }
                },
                fields: 'userEnteredValue'
            }
        }, {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    startColumnIndex: 15,
                    endColumnIndex: 16
                },
                cell: {
                    userEnteredValue: {
                        formulaValue: '=IFERROR(FLOOR((ARRAYFORMULA(INDEX(baseattack,MATCH($B2,pokename,0),1))+$I2)*(ARRAYFORMULA(INDEX(basedefense,MATCH($B2,pokename,0),1))+$J2)^0.5*(ARRAYFORMULA(INDEX(basestamina,MATCH($B2,pokename,0),1))+$K2)^0.5*ARRAYFORMULA(INDEX(cpmultiplier,MATCH(40,levels,0),1))^2/10),0)'
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