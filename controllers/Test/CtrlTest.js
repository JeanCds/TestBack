exports.RecordUpdate = function(req, res) {
    require(process.cwd() + '/controllers/Test/MdlTest').RecordUpdate().then(function(data) {
        res.end(JSON.stringify({ success: true, Data: data }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.Search = function(req, res) {
    require(process.cwd() + '/controllers/Test/MdlTest').Search(req.body.text, req.body.option).then(function(data) {
        res.end(JSON.stringify({ success: true, Data: data }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.SetData = function(req, res) {
    require(process.cwd() + '/controllers/Test/MdlTest').SetData().then(function(data) {
        res.end(JSON.stringify({ success: true, Data: data }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.GetData = function(req, res) {
    require(process.cwd() + '/controllers/Test/MdlTest').GetData().then(function(data) {
        res.end(JSON.stringify({ success: true, Data: data }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.Test = function(req, res) {
    require(process.cwd() + '/controllers/Test/MdlTest').Test(req.body.name, req.body.array, req.body.array2).then(function(data) {
        res.end(JSON.stringify({ success: true, TestResult: data }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.Test2 = function(req, res) {
    require(process.cwd() + '/controllers/Test/MdlTest').Test2().then(function(data) {
        res.end(JSON.stringify({ success: true, data: data }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.Test4 = function(req, res) {
    require(process.cwd() + '/controllers/Test/MdlTest').Test4().then(function(data) {
        res.end(JSON.stringify({ success: true, data: data }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

exports.OracleTest = function(req, res) {
    require(process.cwd() + '/controllers/Test/MdlTest').OracleTest().then(function(recordset) {
        res.end(JSON.stringify({ success: true }, null, 3));
    }).catch(function(err) { require(process.cwd() + '/controllers/CtrlTool').onError(err, res); })
}

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
