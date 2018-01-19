exports.onError = function(err, res) {
    console.log('FAIL: ' + err.message);
    res.end(JSON.stringify({ success: false, Error: err.message }, null, 3));
}

var fileSearch = function(dir, fileName) {
    var fs = require('fs')
    var path = require('path')

    var filePath = ''
    try {
        fs.readdirSync(dir).forEach(file => {
            if (filePath != '') { return }
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                filePath = fileSearch(path.join(dir, file), fileName)
                if (filePath !== '') { return filePath }
            }
            else {
                if (file === fileName) {
                    filePath  =  dir
                    return filePath
                }
            }
        })
    } catch (err) {
        throw err
    }
    return filePath 
}
exports.fileSearch = fileSearch
