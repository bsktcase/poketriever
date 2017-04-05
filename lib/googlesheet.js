const google = require('googleapis'),
    config = require('../config/private/mygooglesheets.json'),
    authentication = require('./googleauth');


function appendData(auth) {
    var sheets = google.sheets('v4');
    var myid = config.testsheetid;
    sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: myid,
        range: 'Sheet1!A2:B', //Change Sheet1 if your worksheet's name is something else
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                ['Void', 'Canvas', 'Website'],
                ['Paul', 'Shan', 'Human']
            ]
        }
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        } else {
            console.log('Appended');
        }
    });
}

authentication.authenticate().then((auth) => {
    appendData(auth);
});