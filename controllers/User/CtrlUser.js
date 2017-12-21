exports.Connect = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    function onError(err) { var ToolCtrl = require(process.cwd() + '/controllers/CtrlTool'); ToolCtrl.onError(err, res) }
    function onSuccess(Token) {
        res.end(JSON.stringify({ success: true, Token: Token }, null, 3))
    }
    var UserMdl = require(process.cwd() + '/controllers/User/MdlUser')
    UserMdl.Connect(onError, onSuccess, req.body.Login, req.body.Password)
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
