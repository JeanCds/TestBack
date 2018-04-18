exports.ProjectList = function(onError, onSuccess) {
    var Config = require(process.cwd() + '/config')
    var ProjectList = [{Name: 'Project1'}, {Name: 'Project2'}, {Name: 'Project3'}]
    onSuccess(ProjectList)
}

exports.JobTree = function(Projet, JobMaster) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')
        var fs = require('fs')
        var path = require('path')

        var fileSearch = function(dir, filelist, searchMask) {
            fs.readdirSync(dir).forEach(file => {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    var Folder = { type: 'Folder', name: file, filelist: [] }
                    fileSearch(path.join(dir, file), Folder.filelist, searchMask)
                    filelist.push(Folder)
                }
                else {
                    if (file.endsWith(searchMask)) {
                        var name = file.substring(0, file.lastIndexOf(searchMask))
                        if (searchMask === '.item') {
                            var version = name.substring(name.lastIndexOf('_') + 1)
                            name = name.substring(0, name.lastIndexOf('_'))
                            filelist.push({ type: 'File', name: name, version: version })
                        } else {
                            filelist.push({ type: 'File', name: name })
                        }
                    }
                }
                filelist.sort(function(a, b){
                    var x = (a.type == 'Folder' ? 'A' : 'B').toLowerCase() + '-' + a.name.toLowerCase()
                    var y = (b.type == 'Folder' ? 'A' : 'B').toLowerCase() + '-' + b.name.toLowerCase()
                    return x < y ? -1 : x > y ? 1 : 0;
                })
            })
        }

        Projet = 'P_OUTILS'
        JobMaster = 'MCO00_998_ValidationDev'
        var JobRootDirectory = 'D:/TalendSource/Referentiel/DEV/' + Projet + '/Exe/' + JobMaster + '/'
        var JobDirectory = JobRootDirectory + JobMaster + '_Seq' + '/items/' + Projet + '/process/'
        var JobTree = { SourceList: [], JavaList: [] }
        fileSearch(JobDirectory, JobTree.SourceList, '.item')
        JobDirectory = JobRootDirectory + JobMaster + '_Seq' + '/src/main/java/routines/'
        fileSearch(JobDirectory, JobTree.JavaList, '.java')
        resolve(JobTree)
    })
}

exports.JobSource = function(Projet, JobMaster, JobNom, Version) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')
        var fs = require('fs')
        var path = require('path')

        var JobRootDirectory = 'D:/TalendSource/Referentiel/DEV/' + Projet + '/Exe/' + JobMaster + '/'
        var JobDirectory = JobRootDirectory + JobMaster + '_Seq' + '/items/' + Projet + '/process/'
        var fileName = JobNom + '_' + Version + '.item'
        var SourcePath = require(process.cwd() + '/controllers/CtrlTool').fileSearch(JobDirectory, fileName)
        if (SourcePath !== '') {
            fs.readFile(path.join(SourcePath, fileName), 'utf8', function read(err, data) {
                if (err) { throw err }
                resolve({ SourcePath: SourcePath, JobSource: data })
            })
        } else {
            resolve({ JavaPath: '', JobSource: '' })
        }
    })
}

exports.JobJava = function(Projet, JobMaster, JavaNom) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')
        var fs = require('fs')
        var path = require('path')

        var fileSearch = function(dir, fileName, JavaPath) {
            var JavaPath = ''
            fs.readdirSync(dir).forEach(file => {
                if (JavaPath != '') { return }
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    JavaPath = fileSearch(path.join(dir, file), fileName, JavaPath)
                    if (JavaPath !== '') { return JavaPath }
                }
                else {
                    if (file === fileName + '.java') {
                        JavaPath  =  dir
                        return JavaPath
                    }
                }
            })
            return JavaPath 
        }

        var JobRootDirectory = 'D:/TalendSource/Referentiel/DEV/' + Projet + '/Exe/' + JobMaster + '/'
        var JobDirectory = JobRootDirectory + JobMaster + '_Seq' + '/src/main/java/routines/'
        var JavaPath = fileSearch(JobDirectory, JavaNom, JavaPath)
        if (JavaPath !== '') {
            fs.readFile(path.join(JavaPath, JavaNom + '.java'), 'utf8', function read(err, data) {
                if (err) { throw err }
                var JavaSource = data
                resolve({ JavaPath: JavaPath, JavaSource: JavaSource })
            })
        } else {
            resolve({ JavaPath: '', JavaSource: '' })
        }
    })
}

exports.JobTreeOld = function(onError, onSuccess, Project) {
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

// Composition
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

exports.Composant = function(Project, JobMaster, JobNom, ComposantId) {
    return new Promise((resolve, reject) => {
        var Config = require(process.cwd() + '/config')

        var Composant = { NodeList: [], ConnectionList: [], NoteList: [], MinX: 999999, MaxX: 0, MinY: 999999, MaxY: 0 }
        var fs = require('fs');
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        var FileLocation = "D:/TalendSource/Referentiel/DEV/P_OUTILS/Exe/MCO00_998_ValidationDev/MCO00_998_ValidationDev_Seq/items/p_outils/process/MCO/Test/MCO00_998_ValidationDev_Seq_1.8.item";
        fs.readFile(FileLocation, function(err, data) {
            parser.parseString(data, function (err, result) {
                for (var NodeNum = 0; NodeNum < result["talendfile:ProcessType"].node.length; NodeNum++) {
                    var NodeXml = result["talendfile:ProcessType"].node[NodeNum];
                    var Node = {
                        componentName: NodeXml.$["componentName"],
                        offsetLabelX: NodeXml.$["offsetLabelX"],
                        offsetLabelY: NodeXml.$["offsetLabelY"],
                        posX: NodeXml.$["posX"],
                        posY: NodeXml.$["posY"]
                    }
                    for (var ParameterNum = 0; ParameterNum < NodeXml.elementParameter.length; ParameterNum++) {
                        var ParameterXml = NodeXml.elementParameter[ParameterNum];
                        Node[ParameterXml.$["name"]] = ParameterXml.$["value"]
                    }
                    if (Node.UNIQUE_NAME === ComposantId) {
                        Composant = Node
                        break
                    }
                }
                resolve(Composant)
            });
        });
    });
}

exports.Compare = function(Project, JobMaster, JobNom, ComposantId) {
    return new Promise((resolve, reject) => {
        var fs = require('fs')
        var path = require('path')
        var Config = require(process.cwd() + '/config')

        var JobCompare = {
            Project: Project,
            JobMaster: JobMaster,
            Environnement1: 'Env1',
            Environnement2: 'Env2',
            ItemList: []
        }

        // Lister les fichiers item à comparer
        var ItemListGet = function(Env, Location) {
            var ItemList = ItemSearchSync(JobLocation)
            ItemList.sort(function(a, b){
                var x = a.Location.toLowerCase()
                var y = b.Location.toLowerCase()
                return x < y ? -1 : x > y ? 1 : 0
            })
            for (let Item of ItemList) {
                let JobNom = Item.file.substring(0, Item.file.lastIndexOf('_'))
                let Version = Item.file.substring(Item.file.lastIndexOf('_') + 1, Item.file.lastIndexOf('.'))
                let Compare = { JobNom: JobNom }
                let CompareList = JobCompare.ItemList.filter(a => a.JobNom === JobNom)
                if (CompareList.length > 0) { Compare = CompareList[0] }
                else { JobCompare.ItemList.push(Compare) }
                Compare[Env] = {
                    Location: Item.Location,
                    Version: Version,
                    Note: null,
                    ComposantList: null,
                }
            }
        }
        var JobLocation = "D:/TalendSource/Referentiel/DEV/P_OUTILS/Exe/MCO00_998_ValidationDev/MCO00_998_ValidationDev_Seq/items/p_outils/process/"
        ItemListGet('Env1', JobLocation)
        JobLocation = "D:/TalendSource/Referentiel/MCO/P_OUTILS/Exe/MCO00_998_ValidationDev/MCO00_998_ValidationDev_Seq/items/p_outils/process/"
        ItemListGet('Env2', JobLocation)

        // Récuépration des composants des items
        JobCompare.ItemList.forEach( function(Item) {
            if (Item.Env1) {
                ItemCoposantGet(Item.Env1.Location).then((data) => {
                    Item.Env1.ComposantList = data
                    CompareEnd()
                })
            }
            if (Item.Env2) {
                ItemCoposantGet(Item.Env2.Location).then((data) => {
                    Item.Env2.ComposantList = data
                    CompareEnd()
                })
            }
        })
        
        // Vérification de la fin de récupération des informations
        var CompareEnd = function() {
            let NotFinishNbr = JobCompare.ItemList.filter(a => (a.Env1 && !a.Env1.ComposantList) || (a.Env2 && !a.Env2.ComposantList)).length
            if (NotFinishNbr > 0) { return }
            for (let Item of JobCompare.ItemList) {
                if (Item.Env1 && Item.Env2 && JSON.stringify(Item.Env1.ComposantList) !== JSON.stringify(Item.Env2.ComposantList)) {
                    Item.ComposantList = []
                    for (let Composant1 of Item.Env1.ComposantList) {
                        let Composant2List = Item.Env2.ComposantList.filter(a => a.UNIQUE_NAME === Composant1.UNIQUE_NAME)
                        let Composant2 = null
                        if (Composant2List.length > 0) { Composant2 = Composant2List[0] }
                        if (!Composant2 || JSON.stringify(Composant1) !== JSON.stringify(Composant2)) {
                            Item.ComposantList.push({UNIQUE_NAME: Composant1.UNIQUE_NAME, Composant1: Composant1, Composant2: Composant2})
                        }
                    }
                    for (let Composant2 of Item.Env2.ComposantList) {
                        let Composant1List = Item.Env1.ComposantList.filter(a => a.UNIQUE_NAME === Composant2.UNIQUE_NAME)
                        if (Composant1List.length === 0) {
                            Item.ComposantList.push({UNIQUE_NAME: Composant2.UNIQUE_NAME, Composant1: null, Composant2: Composant2})
                        }
                    }
                }
                if (Item.Env1) { Item.Env1.ComposantList = undefined }
                if (Item.Env2) { Item.Env2.ComposantList = undefined }
            }
            resolve(JobCompare)
        }
    })
}

var ItemSearchSync = function(dir, ItemList) {
    var fs = require('fs')
    var path = require('path')
    if (!ItemList) { ItemList = [] }
    fs.readdirSync(dir).forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            ItemSearchSync(path.join(dir, file), ItemList)
        }
        else {
            if (file.endsWith('.item')) {
                ItemList.push({
                    file: file,
                    Location: path.join(dir, file)
                })
            }
        }
    })
    return ItemList
}

var ItemCoposantGet = function(FileLocation) {
    return new Promise((resolve, reject) => {
        var fs = require('fs')
        var xml2js = require('xml2js')
        var parser = new xml2js.Parser()
        var ComposantList = []
        fs.readFile(FileLocation, function(err, data) {
            parser.parseString(data, function (err, result) {
                for (var NodeNum = 0; NodeNum < result["talendfile:ProcessType"].node.length; NodeNum++) {
                    var NodeXml = result["talendfile:ProcessType"].node[NodeNum];
                    var Composant = {
                        componentName: NodeXml.$["componentName"],
                        offsetLabelX: NodeXml.$["offsetLabelX"],
                        offsetLabelY: NodeXml.$["offsetLabelY"],
                        posX: NodeXml.$["posX"],
                        posY: NodeXml.$["posY"]
                    }
                    for (var ParameterNum = 0; ParameterNum < NodeXml.elementParameter.length; ParameterNum++) {
                        var ParameterXml = NodeXml.elementParameter[ParameterNum];
                        Composant[ParameterXml.$["name"]] = ParameterXml.$["value"]
                    }
                    ComposantList.push(Composant)
                }
            })
            resolve(ComposantList)
        })
    })
}