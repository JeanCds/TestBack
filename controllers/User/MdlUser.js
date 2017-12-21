exports.Connect = function(onError, onSuccess, Login, Password) {
    var Config = require(process.cwd() + '/config')
    var sql = require('mysql');
    var jwt = require('jsonwebtoken');
    var BddTool = require(process.cwd() + '/global/BddTool');
    
    // Creat user token
    var certText = 'certTest'
    var token = jwt.sign({ UserId: 3, Login: 'UserName', RoleId: 0 }, certText, { algorithm: 'HS256'})
    console.log(token)

    // Read user token
    try {
        var tokenDecoded = jwt.verify(token, certText, { algorithm: 'HS256'})
        console.log(tokenDecoded)
    } catch (err) {
        console.error(err)
    }
    
    BddTool.QueryExec('SELECT 1 + 1 AS solution', onError, (recordset) => { 
        var Token = recordset[0].solution
        onSuccess(Token)
    })
}
