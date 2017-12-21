exports.Check = function(onError, onSuccess, FileName) {
    var Config = require(process.cwd() + '/config')
    var path = require('path');
    var fs = require('fs-extra');
    var Projet = "";
    var JobVersion = "";
    var CreationDate = "";
    var Xms = "";
    var Xmx = "";
    var context = "";
    var CpList = "";
    var TalendVersion = "";

    function CheckStart() {
        var Sequenceur = FileName.split(".")[0];
        var FileFolder = path.join(Config.WorkSpaceFolder, "/Upload/Temp/");
        var FileLocation = path.join(FileFolder, FileName);
        
        try {
            var FolderRootFlg = true;

            // Check if root folder exist and get info
            var AdmZip = require('adm-zip');
            var zip = new AdmZip(FileLocation);
            var zipEntries = zip.getEntries();
            zipEntries.forEach(function(zipEntry) {
                if (zipEntry.entryName == "jobInfo.properties") { FolderRootFlg = false; }

                // Get job info properties
                if (zipEntry.entryName.endsWith("jobInfo.properties")) {
                    var LineList = zip.readAsText(zipEntry.entryName).split('\n');
                    for(var LineNum = 0; LineNum < LineList.length; LineNum++){
                        var Line = LineList[LineNum].trim();
                        var InfoType = Line.split('=')[0].trim();
                        if (InfoType == "project") { Projet = Line.split('=')[1].trim(); }
                        else if (InfoType == "jobVersion") { JobVersion = Line.split('=')[1].trim(); }
                        else if (InfoType == "date") { CreationDate = Line.split('=')[1].trim(); }
                        else if (InfoType == "cmdLineVersion") { TalendVersion = Line.split('=')[1].trim(); }
                        else if (InfoType == "contextName") { context = Line.split('=')[1].trim(); }
                    }
                }

                // Get Bat file info
                if (zipEntry.entryName.endsWith(Sequenceur + "_Seq_run.bat")) {
                    var LineList = zip.readAsText(zipEntry.entryName).split('\n');
                    for(var LineNum = 0; LineNum < LineList.length; LineNum++){
                        var Line = LineList[LineNum].trim();
                        if (Line.startsWith("java ")) {
                            var ParamList = Line.substring(4).split(' -');
                            for(var ParamNum = 0; ParamNum < ParamList.length; ParamNum++){
                                var Param = ParamList[ParamNum].trim();
                                if (Param.startsWith("Xms")) { Xms = Param.substring(3).trim(); }
                                else if (Param.startsWith("Xmx")) { Xmx = Param.substring(3).trim(); }
                                else if (Param.startsWith("-context=") && context == "") { context = Param.substring(9).trim().split(' ')[0]; }
                                else if (Param.startsWith("cp ")) {
                                    CpList = Param.substring(3).split(';');
                                    if (Projet == "") {
                                        for(var CpNum = 0; CpNum < CpList.length; CpNum++){
                                            var Cp = CpList[CpNum].trim();
                                            if (Cp.endsWith(Sequenceur + "_Seq")) {
                                                Projet = Cp.split('.')[0].toUpperCase();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // Creat unzip folder if no root folder into zip file
            if (!FolderRootFlg) {
                var JobFolderName = FileName.split(".")[0];
                var UnzipFolder = path.join(FileFolder, "/" + JobFolderName + "/" + JobFolderName + "/");
                var UnzipFolder2 = path.join(FileFolder, "/" + JobFolderName + "/");
                try { if (!fs.existsSync(UnzipFolder2)) { fs.mkdirSync(UnzipFolder2); } }
                catch (err) { onError(err); return false; }
                try { if (!fs.existsSync(UnzipFolder)) { fs.mkdirSync(UnzipFolder); } }
                catch (err) { onError(err); return false; }
                zip.extractAllTo(UnzipFolder, true);

                // Delete zip
                try { fs.unlinkSync(FileLocation); }
                catch (err) { onError(err); return false; }
                

                // Create new zip
                var zipdir = require('zip-dir');
                zipdir(UnzipFolder2, { saveTo: FileLocation }, function (err, buffer) {
                    if(err) { onError(err) }
                    else { 
                        fs.remove(UnzipFolder2, function (err) {
                            if(err) { onError(err) }
                            else { CheckEnd(); }
                        });
                    }
                });
            } else { CheckEnd(); }
        } catch (err) { onError(err) }
    }
    try { CheckStart(onError, onSuccess); } catch (err) { onError(err) }

    function CheckEnd() {
        onSuccess(Projet, JobVersion, CreationDate, Projet, Xms, Xmx, context, CpList, TalendVersion);
    }
}
