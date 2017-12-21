exports.onError = function(err, res) {
    console.log('FAIL: ' + err.message);
    res.end(JSON.stringify({ success: false, Error: err.message }, null, 3));
}