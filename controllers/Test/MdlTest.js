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
