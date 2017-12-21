var Config = require(process.cwd() + '/config')

var QueryExecMsSql = function(onError, onSuccess, Query) {
    var sql = require('mssql')
    sql.connect(Config.AppBdd.config).then(() => { return Query}).then(result => {
        sql.close()
        onSuccess(result.recordset)
    }).catch(err => {
        sql.close()
        onError(err)
    })
    sql.on('error', err => {
        sql.close()
        onError(err)
    })
}

var QueryExecMySql = function(onError, onSuccess, Query) {
    var sql = require('mysql')
    var connection = sql.createConnection(Config.AppBdd.configMySql)
    connection.query(Query, function (err, results, fields) {
        if (err) onError(err)
        onSuccess(results)
    })
    connection.end()
}

exports.QueryExec = function(Query, onError, onSuccess) {
    if (Config.AppBdd.Type === 'MsSql') {
        QueryExecMsSql(onError, onSuccess, Query)
    } else if (Config.AppBdd.Type === 'MySql') {
        QueryExecMySql(onError, onSuccess, Query)
    } else if (Config.AppBdd.Type === 'Oracle') {
        
    }
}
