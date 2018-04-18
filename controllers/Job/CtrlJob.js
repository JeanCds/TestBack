exports.ProjectList = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    function onError(err) { var ToolCtrl = require(process.cwd() + '/controllers/CtrlTool'); ToolCtrl.onError(err, res) }
    function onSuccess(ProjectList) {
        res.end(JSON.stringify({ success: true, ProjectList: ProjectList }, null, 3));
    }

    var JobMdl = require(process.cwd() + '/controllers/Job/MdlJob');
    JobMdl.ProjectList(onError, onSuccess);
}

exports.JobTree = function(req, res) {
    require(process.cwd() + '/controllers/Job/MdlJob')
    .JobTree(req.body.Project, req.body.JobMaster, req.body.JobNom)
    .then(function(JobTree) {
        res.end(JSON.stringify({ success: true, JobTree: JobTree }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.JobSource = function(req, res) {
    require(process.cwd() + '/controllers/Job/MdlJob')
    .JobSource(req.body.Project, req.body.JobMaster, req.body.JobNom, req.body.Version)
    .then(function(data) {
        res.end(JSON.stringify({ success: true, SourcePath: data.SourcePath, JobSource: data.JobSource }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.JobJava = function(req, res) {
    require(process.cwd() + '/controllers/Job/MdlJob')
    .JobJava(req.body.Project, req.body.JobMaster, req.body.JavaNom)
    .then(function(data) {
        res.end(JSON.stringify({ success: true, JavaPath: data.JavaPath, JavaSource: data.JavaSource }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.JobTreeOld = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    function onError(err) { var ToolCtrl = require(process.cwd() + '/controllers/CtrlTool'); ToolCtrl.onError(err, res) }
    function onSuccess(JobTree) {
        res.end(JSON.stringify({ success: true, JobTree: JobTree }, null, 3));
    }

    var JobMdl = require(process.cwd() + '/controllers/Job/MdlJob');
    var Project = req.body.Project;
    JobMdl.JobTree(onError, onSuccess, Project);
}

exports.JobInfo = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    function onError(err) { var ToolCtrl = require(process.cwd() + '/controllers/CtrlTool'); ToolCtrl.onError(err, res) }
    function onSuccess(JobInterface) {
        res.end(JSON.stringify({ success: true, JobInterface: JobInterface }, null, 3));
    }

    var JobMdl = require(process.cwd() + '/controllers/Job/MdlJob');
    var JobInterfaceID = "22";
    JobMdl.JobInfo(onError, onSuccess, JobInterfaceID);
}

exports.JobArchiveCheck = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    function onError(err) { var ToolCtrl = require(process.cwd() + '/controllers/CtrlTool'); ToolCtrl.onError(err, res) }
    function onSuccess(Projet, JobVersion, CreationDate, Projet, Xms, Xmx, context, CpList, TalendVersion) {
        res.end(JSON.stringify({ success: true, Projet: Projet, JobVersion: JobVersion, CreationDate: CreationDate, Projet: Projet, Xms: Xms, Xmx: Xmx, context: context, CpList: CpList, TalendVersion: TalendVersion }, null, 3));
    }
    
    var JobArchiveMdl = require(process.cwd() + '/controllers/Job/MdlJobArchive');
    var FileName = req.body.FileName;
    JobArchiveMdl.Check(onError, onSuccess, FileName);
}

exports.ItemList = function(req, res) {
    require(process.cwd() + '/controllers/Job/MdlJob')
    .ItemList(req.body.Project, req.body.JobMaster, req.body.JobNom)
    .then(function(ItemList) {
        res.end(JSON.stringify({ success: true, ItemList: ItemList }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.Composant = function(req, res) {
    require(process.cwd() + '/controllers/Job/MdlJob')
    .Composant(req.body.Project, req.body.JobMaster, req.body.JobNom, req.body.ComposantId)
    .then(function(Composant) {
        res.end(JSON.stringify({ success: true, Composant: Composant }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.Compare = function(req, res) {
    require(process.cwd() + '/controllers/Job/MdlJob')
    .Compare(req.body.Project, req.body.JobMaster)
    .then(function(Composant) {
        res.end(JSON.stringify({ success: true, Composant: Composant }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}
