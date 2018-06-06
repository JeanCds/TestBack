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

var QueryExecMySqlSync = (Query) => {
    var sql = require('mysql-libmysqlclient')
    var connection = sql.createConnection(Config.AppBdd.configMySql)
    var handle = connection.querySync(Query)
    var results = handle.fetchAllSync()
    connection.end()
    return results
}

exports.QueryExecSync = function(Query) {
    if (Config.AppBdd.Type === 'MsSql') {

    } else if (Config.AppBdd.Type === 'MySql') {
        return QueryExecMySqlSync(Query)
    } else if (Config.AppBdd.Type === 'Oracle') {
        
    }
    return null
}

var floatFormat = function(Text) {
    return Text
}

var intFormat = function(Text) {
    return Text
}

var stringFormat = function(Text) {
    return Text
}

exports.RecordAddUpdate = function(BddId, Environnement, TableName, Record) {
    return new Promise((resolve, reject) => {
        var BddSchema = require(process.cwd() + '/global/BddSchema')

        var ColumnKey = ''
        var ColumnList = []
        var Schema = BddSchema.getSchema()
        var Table = Schema[BddId][TableName]
        for(var ColumnName in Table) {
            var Column = Table[ColumnName]
            if (Column.Key) {
                ColumnKey = ColumnName
            } else {
                if (Record[ColumnName] !== undefined && Record[ColumnName] !== null) {
                    ColumnList.push(ColumnName)
                }
            }
        }

        var Query = ''
        if (Record[ColumnKey] !== undefined && Record[ColumnKey] !== null && Record[ColumnKey] !== 0 && Record[ColumnKey] !== '') {
            var UpdateListText = ''
            for(var ColumnName of ColumnList) {
                if (UpdateListText !== '') { UpdateListText += `AND ` }
                UpdateListText += `"${ColumnName}" = `
                if (Table[ColumnName].type === 'String') {
                    UpdateListText += `'${stringFormat(Record[ColumnName])}' `
                } else if (Table[ColumnName].type === 'Int') {
                    UpdateListText += `${intFormat(Record[ColumnName])} `
                } else {
                    UpdateListText += `${Record[ColumnName]} `
                }
            }
            Query = `
                UPDATE ${TableName} 
                SET ${UpdateListText} 
                WHERE ${ColumnKey} = ${Record[ColumnKey]} 
            `
        } else {
            var ColumnListText = ''
            var ValueListText = ''
            for(var ColumnName of ColumnList) {
                if (ColumnListText !== '') { ColumnListText += `, ` }
                ColumnListText += `"${ColumnName}"`
                if (ValueListText !== '') { ValueListText += `, ` }
                if (Table[ColumnName].type === 'String') {
                    ValueListText += `'${stringFormat(Record[ColumnName])}' `
                } else if (Table[ColumnName].type === 'Int') {
                    ValueListText += `${intFormat(Record[ColumnName])} `
                } else {
                    ValueListText += `'${Record[ColumnName]}'`
                }
            }
            Query = `
                INSERT INTO ${TableName} (${ColumnListText}) 
                VALUES (${ValueListText}) 
            `
        }

        resolve(Query)
    })
}
