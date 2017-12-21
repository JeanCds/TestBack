exports.PromiseTest = function(JobInterfaceID) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')
        var sql = require('mssql');
    
        sql.connect(Config.AppBdd.config).then(() => { return sql.query`
            SELECT TOP 1 * 
            FROM   dsi_hlp_JobInterface WITH(NOLOCK)  
            WHERE  JobInterfaceID = ${JobInterfaceID} 
        `}).then(result => {
            sql.close();
            resolve(result.recordset);
        }).catch(err => { sql.close(); reject(err); })
        sql.on('error', err => { sql.close(); reject(err); })
    });
}
