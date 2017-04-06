const google = require('googleapis'),
    sheets = google.sheets('v4'),
    //moment = require('moment'),
    config = require('../../config/private/mygooglesheets.json');

let myid = config.testsheetid;

module.exports.create = createSheet;
module.exports.append = appendData;

function createSheet(auth) {
    return new Promise(function (resolve, reject) {
        //var sheetname = moment(Date.now()).format('MMDDhhmmss');
        var request = {
            auth: auth,
            spreadsheetId: myid,
            resource: {
                // A list of updates to apply to the spreadsheet.
                // Requests will be applied in the order they are specified.
                // If any request is not valid, no requests will be applied.
                requests: [{
                    'addSheet': {
                        'properties': {
                            'title': 'Test1',
                            'gridProperties': {
                                'rowCount': 1,
                                'columnCount': 8
                            },
                            // 'tabColor': {
                            //     'red': 1.0,
                            //     'green': 0.3,
                            //     'blue': 0.4
                            // }
                        }
                    }
                } //,
                    // // TODO: split this, get the correct sheet id, then just do an append(?)
                    // {
                    //     'updateCells': {
                    //         'range': {
                    //             'sheetId': 0,
                    //             'startRowIndex': 0,
                    //             'startColumnIndex': 0
                    //         },
                    //         'rows': [{
                    //             'values': [{
                    //                 'userEnteredValue': {
                    //                     'stringValue': '#'
                    //                 },
                    //                 'userEnteredFormat': {
                    //                     'horizontalAlignment': 'CENTER',
                    //                     'textFormat': {
                    //                         'bold': true
                    //                     }
                    //                 }
                    //             },
                    //             {
                    //                 'userEnteredValue': {
                    //                     'stringValue': 'pokémon'
                    //                 }
                    //             },
                    //             {
                    //                 'userEnteredValue': {
                    //                     'stringValue': 'level'
                    //                 }
                    //             },
                    //             {
                    //                 'userEnteredValue': {
                    //                     'stringValue': 'atk'
                    //                 }
                    //             },
                    //             {
                    //                 'userEnteredValue': {
                    //                     'stringValue': 'def'
                    //                 }
                    //             },
                    //             {
                    //                 'userEnteredValue': {
                    //                     'stringValue': 'sta'
                    //                 }
                    //             },
                    //             {
                    //                 'userEnteredValue': {
                    //                     'stringValue': 'quick move'
                    //                 }
                    //             },
                    //             {
                    //                 'userEnteredValue': {
                    //                     'stringValue': 'charge move'
                    //                 }
                    //             }
                    //             ]
                    //         }],
                    //         'fields': '*'
                    //     }
                    // }
                ],
            },
        };

        sheets.spreadsheets.batchUpdate(request, function (err, response) {
            if (err) {
                console.log(err);
                // TODO: reject
                reject(err);
            }

            // TODO: Change code below to process the `response` object:
            // TODO: return the sheet id
            console.log(JSON.stringify(response, null, 2));
            resolve(auth);
        });
    });
}

function appendData(auth) {
    var request = {
        auth: auth,
        spreadsheetId: myid,
        range: 'Test1!A1:H1',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                ['#', 'pokémon', 'level', 'atk', 'def', 'sta', 'quick move', 'charge move']
            ]
        }
    };

    sheets.spreadsheets.values.append(request, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        console.log('Appended:');
        // TODO: Change code below to process the `response` object:
        console.log(JSON.stringify(response, null, 2));
    });
}