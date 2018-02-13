var Config = require(process.cwd() + '/config')

var Schema = {
    Bdd1: {
        dsi_hlp_utilisateur: {
            UtilisateurID: { type: "int", key: true },
            Identifiant: { type: "String" },
            MotDePasse: { type: "String" },
        },
        dsi_hlp_JobSequenseur: {
            JobSequenseurID: { type: "int", key: true },
            Projet: { type: "String" },
            Sequenseur: { type: "String" },
        },
        generic_parameter: {
            id: { type: "int", key: true },
            Theme: { type: "String" },
            Environnement: { type: "String" },
            NewCol: { type: "String" }
        }
    },
    Bdd2: {
        Parametre: {
            ParametreID: { type: "String", key: true },
            Alias: { type: "String" },
            Nom: { type: "String" },
        }
    }

}

exports.getSchema = function() {
    return Schema
}

exports.getTableConfig = function(TableName) {
    return new Promise((resolve, reject) => {
        var BddTool = require(process.cwd() + '/global/BddTool')
        var Config = { TableName: TableName }
        var Query = ''
        Query = `DESCRIBE ${TableName}`
        // Exec SP_Columns ${TableName}
        BddTool.QueryExec(Query, (err) => { }, (recordset) => { 
            if (recordset === undefined) {
                Config.Error = 'Table manquante'
            } else {
                Config.ColumnList = []
                Config.Column = []
                for(var Column of recordset) {
                    // console.log(Column)
                    Config.ColumnList.push(Column.Field)
                    Config.Column.push({ name: Column.Field, type: Column.Type })
                }
            }
            resolve(Config)
        })
    })
}
