exports.SchemaCheck = function() {
    return new Promise((resolve, reject) => {
        var BddTool = require(process.cwd() + '/global/BddTool')
        var BddSchema = require(process.cwd() + '/global/BddSchema')

        var Schema = BddSchema.getSchema()
        var CheckResult = {}
        var TableNbr = Object.keys(Schema.Bdd1).length
        var TableTreated = 0

        function getTableAnalyse(TableName)
        {
            BddTool.QueryExec(`SELECT * FROM ${TableName} LIMIT 1`, (err) => { }, (recordset) => { 
                console.log('recordset')
                console.log(recordset)
                if (recordset === undefined) {
                    CheckResult[TableName].push({TableName: TableName, Error: 'Table manquante' })
                } else {
                    /*
                    for(var ColumnName in recordset) {
                        if (TableName[ColumnName] === undefined) {
                            CheckResult[TableName].push({TableName: TableName, ColumnName: ColumnName})
                        }
                    }
                    */
                }
                TableTreated++
                if (TableTreated === TableNbr) { resolve(CheckResult) }
            })
        }
    
        /*
        for(var TableNum = 0; TableNum < TableNbr; TableNum++) {
            var TableName = Object.keys(Schema.Bdd1)[TableNum]
            CheckResult[TableName] = []
            getTableAnalyse(TableName)
        }
        */
        for(var TableName in Schema.Bdd1) {
            CheckResult[TableName] = {}
            BddSchema.getTableConfig(TableName).then(function(TableConfig) {
                var TableName = TableConfig.TableName
                CheckResult[TableName] = []
                if (TableConfig.Column === undefined) {
                    CheckResult[TableName].push({TableName: TableName, Error: 'Table manquante' })
                } else {
                    for(var ColumnName in Schema.Bdd1[TableName]) {
                        if (!TableConfig.ColumnList.includes(ColumnName)) {
                            CheckResult[TableName].push({ TableName: TableName, ColumnName: ColumnName, Error: 'Colonne manquante' })
                        }
                    }
                }
                TableTreated++
                if (TableTreated === TableNbr) { resolve(CheckResult) }
            })
        }
    })
}

exports.OracleTest = function(JobInterfaceID) {
    return new Promise((resolve, reject) => {
        var oracledb = require('oracledb')
        oracledb.getConnection(
        {
            user          : "DSUSER",
            password      : "dsqtgb",
            connectString : "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=ces-ora.cdbdx.biz)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=ces-ora1.cdbdx.biz)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=ces-ora2.cdbdx.biz)(PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=GNXPROD.cdbdx.biz)(FAILOVER_MODE=(TYPE=SELECT)(METHOD=BASIC)(RETRIES=6)(DELAY=20))))"
        },
        function(err, connection)
        {
            if (err) { reject(err); return; }
            connection.execute("SELECT * FROM TEMP_MECA ", function(err, result) {
                if (err) { reject(err); return; }
                console.log(result.rows)
                resolve()
            })
        })
    })
}

exports.PromiseTest = function(JobInterfaceID) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')
        var sql = require('mssql')
    
        sql.connect(Config.AppBdd.config).then(() => { return sql.query`
            SELECT TOP 1 * 
            FROM   dsi_hlp_JobInterface WITH(NOLOCK)  
            WHERE  JobInterfaceID = ${JobInterfaceID} 
        `}).then(result => {
            sql.close()
            resolve(result.recordset)
        }).catch(err => { sql.close(); reject(err) })
        sql.on('error', err => { sql.close(); reject(err) })
    });
}
