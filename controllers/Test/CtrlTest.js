exports.PromiseTest = function(req, res) {
    var JobInterfaceID = req.body.JobInterfaceID;
    require(process.cwd() + '/controllers/Test/MdlTest').PromiseTest(JobInterfaceID).then(function(recordset) {
        res.end(JSON.stringify({ success: true, recordset: recordset }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.SoketIoTest = function(req, res) {
    function onError(err) { var ToolCtrl = require(process.cwd() + '/controllers/CtrlTool'); ToolCtrl.onError(err, res) }
    function onSuccess() {
        res.end(JSON.stringify({ success: true }, null, 3));
    }

    var io = require('socket.io-client');
    var socket = io.connect('http://localhost:3001');
    socket.on('connect', function () {
      socket.emit('server custom event', { my: 'TestJc' });
      onSuccess();
    });
}

exports.XmlToJs = function(req, res) {
    function onError(err) { var ToolCtrl = require(process.cwd() + '/controllers/CtrlTool'); ToolCtrl.onError(err, res) }
    function onSuccess() {
        res.end(JSON.stringify({ success: true }, null, 3));
    }

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
            onSuccess();
        });
    });
}
