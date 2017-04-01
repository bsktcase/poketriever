const fs = require('fs');

function writeFileAsync(path, contents, callback) {
    if (callback) {
        return fs.writeFile(path, contents, callback);
    }

    return new Promise(function (resolve, reject) {
        fs.writeFile(path, contents, function (err, data) {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

module.exports.writeFileToDisk = (path, contents, callback) => {
    var promise = writeFileAsync(path, contents, callback);
    promise.then(console.log('The file was saved!'), console.error);
};