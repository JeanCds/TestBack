exports.ProjectList = function(onError, onSuccess) {
    var Config = require(process.cwd() + '/config')
    var ProjectList = [{Name: 'Project1'}, {Name: 'Project2'}, {Name: 'Project3'}]
    onSuccess(ProjectList)
}

exports.JobTree = function(onError, onSuccess, Project) {
    var Config = require(process.cwd() + '/config')
    var JobTree = []
    if (Project === 'Project1') {
        JobTree = [{
            ItemId: 1,
            Type: 'Folder',
            Name: 'Item1',
            ItemList: [{
              ItemId: 2,
              Type: 'Folder',
              Name: 'Folder1-1',
              ItemList: [{
                ItemId: 6,
                Type: 'File',
                Name: 'Item1-1-1'
              }, {
                ItemId: 7,
                Type: 'File',
                Name: 'Item1-1-2'
              }, {
                ItemId: 8,
                Type: 'File',
                Name: 'Item1-1-3'
              }]
            }, {
            Type: 'File', 
            Name: 'Item2'
            }]
        }, {
            Type: 'File', 
            Name: 'Item3'
        }]
    }
    onSuccess(JobTree)
}

exports.JobInfo = function(onError, onSuccess, JobInterfaceID) {
    var Config = require(process.cwd() + '/config')
    var sql = require('mssql');
    var JobInterface = null;

    sql.connect(Config.AppBdd.config).then(() => { return sql.query`
        SELECT TOP 1 * 
        FROM   dsi_hlp_JobInterface 
        WHERE  JobInterfaceID = ${JobInterfaceID}
    `}).then(result => {
        sql.close();
        JobInterface = result.recordset;
        onSuccess(JobInterface);
    }).catch(err => { sql.close(); onError(err); })
    sql.on('error', err => { sql.close(); onError(err); })
}

exports.ItemList = function(Project, JobMaster, JobNom) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')

        var ItemList = []
        var fs = require('fs');
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        var FileLocation = "D:/TalendSource/Referentiel/DEV/P_OUTILS/Exe/MCO00_998_ValidationDev/MCO00_998_ValidationDev_Seq/items/p_outils/process/MCO/Test/MCO00_998_ValidationDev_Seq_1.8.item";
        fs.readFile(FileLocation, function(err, data) {
            parser.parseString(data, function (err, result) {
                for (var ContextNum = 0; ContextNum < result["talendfile:ProcessType"].context.length; ContextNum++) {
                    var Context = result["talendfile:ProcessType"].context[ContextNum];
                    var confirmationNeeded = Context.$["confirmationNeeded"];
                    var name = Context.$["name"];
                    for (var ContextParameterNum = 0; ContextParameterNum < Context.contextParameter.length; ContextParameterNum++) {
                        var contextParameter = Context.contextParameter[ContextParameterNum];
                        var type = contextParameter.$["type"];
                        var value = contextParameter.$["value"];
                    }
                }
                for (var NodeNum = 0; NodeNum < result["talendfile:ProcessType"].node.length; NodeNum++) {
                    var Node = result["talendfile:ProcessType"].node[NodeNum];
                    var NodeTemp = {
                        componentName: Node.$["componentName"],
                        offsetLabelX: Node.$["offsetLabelX"],
                        offsetLabelY: Node.$["offsetLabelY"],
                        posX: Node.$["posX"],
                        posY: Node.$["posY"]
                    }
                    ItemList.push(NodeTemp)
                }
                resolve(ItemList)
            });
        });
    });
}
