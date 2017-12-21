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

        var ItemList = { NodeList: [], ConnectionList: [], NoteList: [], MinX: 999999, MaxX: 0, MinY: 999999, MaxY: 0 }
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
                    var NodeXml = result["talendfile:ProcessType"].node[NodeNum];
                    var Node = {
                        componentName: NodeXml.$["componentName"],
                        offsetLabelX: NodeXml.$["offsetLabelX"],
                        offsetLabelY: NodeXml.$["offsetLabelY"],
                        posX: NodeXml.$["posX"],
                        posY: NodeXml.$["posY"]
                    }
                    ItemList.MinX = Math.min(ItemList.MinX, Node.posX)
                    ItemList.MinY = Math.min(ItemList.MinY, Node.posY)
                    ItemList.MaxX = Math.max(ItemList.MaxX, Node.posX)
                    ItemList.MaxY = Math.max(ItemList.MaxY, Node.posY)
                    for (var ParameterNum = 0; ParameterNum < NodeXml.elementParameter.length; ParameterNum++) {
                        var ParameterXml = NodeXml.elementParameter[ParameterNum];
                        Node[ParameterXml.$["name"]] = ParameterXml.$["value"]
                    }
                    ItemList.NodeList.push(Node)
                }
                for (var ConnectionNum = 0; ConnectionNum < result["talendfile:ProcessType"].connection.length; ConnectionNum++) {
                    var ConnectionXml = result["talendfile:ProcessType"].connection[ConnectionNum];
                    var Connection = {
                        connectorName: ConnectionXml.$["connectorName"],
                        label: ConnectionXml.$["label"],
                        lineStyle: ConnectionXml.$["lineStyle"],
                        metaname: ConnectionXml.$["metaname"],
                        offsetLabelX: ConnectionXml.$["offsetLabelX"],
                        offsetLabelY: ConnectionXml.$["offsetLabelY"],
                        source: ConnectionXml.$["source"],
                        target: ConnectionXml.$["target"]
                    }
                    for (var ParameterNum = 0; ParameterNum < ConnectionXml.elementParameter.length; ParameterNum++) {
                        var ParameterXml = ConnectionXml.elementParameter[ParameterNum];
                        Connection[ParameterXml.$["name"]] = ParameterXml.$["value"]
                    }
                    ItemList.ConnectionList.push(Connection)
                }
                for (var NoteNum = 0; NoteNum < result["talendfile:ProcessType"].note.length; NoteNum++) {
                    var NoteXml = result["talendfile:ProcessType"].note[NoteNum];
                    var Note = {
                        opaque: NoteXml.$["opaque"],
                        posX: NoteXml.$["posX"],
                        posY: NoteXml.$["posY"],
                        sizeHeight: NoteXml.$["sizeHeight"],
                        sizeWidth: NoteXml.$["sizeWidth"],
                        text: NoteXml.$["text"]
                    }
                    ItemList.MinX = Math.min(ItemList.MinX, Note.posX)
                    ItemList.MinY = Math.min(ItemList.MinY, Note.posY)
                    ItemList.MaxX = Math.max(ItemList.MaxX, Note.posX)
                    ItemList.MaxY = Math.max(ItemList.MaxY, Note.posY)
                    for (var ParameterNum = 0; ParameterNum < ConnectionXml.elementParameter.length; ParameterNum++) {
                        var ParameterXml = ConnectionXml.elementParameter[ParameterNum];
                        Note[ParameterXml.$["name"]] = ParameterXml.$["value"]
                    }
                    ItemList.NoteList.push(Note)
                }
                resolve(ItemList)
            });
        });
    });
}
