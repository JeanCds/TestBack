exports.RecordUpdate = function() {
    var BddId = 'Bdd1'
    var Environnement = 'PRD'
    var TableName = 'dsi_hlp_temp'
    var Record = {
        ID: '10',
        Libelle: 'test'
    }
    return new Promise((resolve, reject) => {
        require(process.cwd() + '/global/BddTool').RecordAddUpdate(
            BddId, Environnement, TableName, Record
        ).then(function(data) {
            resolve(data)
        }).catch(function(err) { reject(err) })
    })
}

exports.Search = function(text, option) {
    return new Promise((resolve, reject) => {

        var ResultList = [
            { methode: Search1, status: -1, data: null },
            { methode: Search2, status: -1, data: null }
        ]

        ResultList.forEach( function(Result) {
            Result.methode({ text: text }).then((data) => {
                Result.status = 1
                Result.data = data
            }).catch(function(err) {
                Result.status = 0
                Result.err = err
            }).then(function() { ResultUpdate() })
        })

        var ResultUpdate = function() {
            var NotFinishNbr = ResultList.filter(a => a.status === -1).length
            if (NotFinishNbr > 0) { return }
            resolve(ResultList)
        }
    });
}

exports.SetData = function() {
    return new Promise((resolve, reject) => {
        var fs = require('fs')
        var Config = require(process.cwd() + '/config')
        var ConfigPath = Config.WorkSpaceFolder + 'MyJson.json'
        var ConfigParsed = JSON.parse(fs.readFileSync(ConfigPath, 'UTF-8'))
        Config.Test = ConfigParsed
        resolve(ConfigParsed)
    })
}

exports.GetData = function() {
    return new Promise((resolve, reject) => {
        var fs = require('fs')
        var Config = require(process.cwd() + '/config')
        resolve(Config)
    })
}

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
    })
}

var Search1 = function(Text) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')
        var sql = require('mssql')
    
        sql.connect(Config.AppBdd.config).then(() => { return sql.query`
            SELECT * 
            FROM   dsi_hlp_JobInterfaceXXx WITH(NOLOCK)  
            WHERE  Sequenceur LIKE '%${Text}%' 
        `}).then(result => {
            sql.close()
            resolve(result.recordset)
        }).catch(err => { sql.close(); reject(err) })
        sql.on('error', err => { sql.close(); reject(err) })
    })
}

var Search2 = function(Text) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')
        var sql = require('mssql')
        resolve('no result')
    })
}

exports.Test = function(name, array, array2) {
    return new Promise((resolve, reject) => {
        console.log(array)
        console.log(array2)
        resolve('TestOk')
    })
}

exports.Test2 = function() {
    return new Promise((resolve, reject) => {
        var MonObjetData = {
            data1: 0,
            data2: 'Montext'
        }
        MaFonction1(MonObjetData)
        .then(MaFonction2)
        .then((data) => {
            console.log(data)
            resolve('TestOk')
        }).catch(function(err) {
            reject(err)
        })
    })
}

exports.Test3 = function() {
    return new Promise((resolve, reject) => {
        var ToDo = {
            Data1: 'Abc',
            Data2: 'Poiu',
            Type1: true,
            Type2: true,
            ContextList: [
                {Truc1: '111', Truc2: 'ihdsgdfh'},
                {Truc1: '111', Truc2: 'sdfklgjh'}
            ]
        }
        var MonObjetData = {
            data1: 0,
            data2: 'Montext'
        }
        MaFonction1(MonObjetData)
        .then(MaFonction2)
        .then((data) => {
            console.log(data)
            resolve('TestOk')
        }).catch(function(err) {
            reject(err)
        })
    })
}

var MaFonction1 = function(MonObjetData) {
    return new Promise((resolve, reject) => {
        throw new Error(`Mon message d'erreur`)
        MonObjetData.data3 = 25 / MonObjetData.data1
        MonObjetData.data1++
        resolve(MonObjetData)
    })
}

var MaFonction2 = function(MonObjetData) {
    return new Promise((resolve, reject) => {
        MonObjetData.NewParam = 'MaValue'
        resolve(MonObjetData)
    })
}
