class uploadMdl {

    constructor() { }
    
    Action1() {
        var path = require('path');
        var formidable = require('formidable');
        var fs = require('fs');
        var cfg = require('../../config')
        
        var DirSearch = path.join(cfg.WorkSpaceFolder, '/Upload');
        var filelist = [];
        /*
        const allFilesSync = (dir, fileList = [], FileFilter) => {
            fs.readdirSync(dir).forEach(file => {
              const filePath = path.join(dir, file)
              fileList.push(fs.statSync(filePath).isDirectory() ? {[file]: allFilesSync(filePath)} : file)
            })
            return fileList
          }
        allFilesSync(DirSearch, filelist, ".csv");
        */
    
        function fromDir(startPath, filter, filelist){
        
            if (!fs.existsSync(startPath)){
                console.log("no dir ",startPath)
                return
            }
        
            var files=fs.readdirSync(startPath)
            for(var i=0;i<files.length;i++){
                var filename=path.join(startPath,files[i])
                var stat = fs.lstatSync(filename)
                if (stat.isDirectory()){
                    fromDir(filename,filter, filelist)
                }
                else if (filename.indexOf(filter)>=0) {
                    filelist.push({ "filename": filename })
                }
            }
        }
        fromDir(DirSearch,'.item', filelist)
        return filelist;
    }
    
    static Action2(req, res) {
        var cfg = require('../../config');
        var sql = require('mssql');
        
        var JobInterfaceID = "22";
        sql.connect(cfg.AppBdd.config).then(() => {
            return sql.query`SELECT TOP 1 * FROM dsi_hlp_JobInterface WHERE JobInterfaceID = ${JobInterfaceID}`
        }).then(result => {
            sql.close()
            res.end(JSON.stringify({ success: true, JobInterface: result.recordset }, null, 3));
        }).catch(err => {
            uploadMdl.ErrorLog("36548769", err)
            sql.close()
            res.end(JSON.stringify({ success: false }, null, 3));
        })
        sql.on('error', err => {
            uploadMdl.ErrorLog("36548769", err)
            sql.close()
            res.end(JSON.stringify({ success: false }, null, 3));
        })

        /*
        (async function () {
            try {
                const pool = await sql.connect("mssql://" + cfg.AppBdd.Login + ":" + cfg.AppBdd.Password + "@" + cfg.AppBdd.Uri + "/" + cfg.AppBdd.DataBase)
                const result = await sql.query`SELECT TOP 1 * FROM dsi_hlp_JobInterface WHERE JobInterfaceID = ${JobInterfaceID}`
                console.dir(result)
            } catch (err) {
                // ... error checks
            }
        })()
        */
        
        /*
        (async function () {
            try {
                const pool = await new Promise(sql.connect("mssql://" + cfg.AppBdd.Login + ":" + cfg.AppBdd.Password + "@" + cfg.AppBdd.Uri + "/" + cfg.AppBdd.DataBase));
                const result = await new Promise(sql.query`SELECT TOP 1 * FROM dsi_hlp_JobInterface WHERE JobInterfaceID = ${JobInterfaceID}`);
                console.log(result)
                console.log(result.recordset)
            } catch (err) {
                // ... error checks
            }
        })()
        */
    
        /*
        (async function () {
            try {
                const pool = await sql.connect("mssql://" + cfg.AppBdd.Login + ":" + cfg.AppBdd.Password + "@" + cfg.AppBdd.Uri + "/" + cfg.AppBdd.DataBase)
                const result = await sql.query`SELECT TOP 1 * FROM dsi_hlp_JobInterface WHERE JobInterfaceID = ${JobInterfaceID}`
                console.log(result)
                console.log(result.recordset)
            } catch (err) {
                // ... error checks
            }
        })()
        */

        /*
        try {
            sql.connect("mssql://" + cfg.AppBdd.Login + ":" + cfg.AppBdd.Password + "@" + cfg.AppBdd.Uri + "/" + cfg.AppBdd.DataBase)
            const request = new sql.Request()
            request.query(`SELECT TOP 1 * FROM dsi_hlp_JobInterface WHERE JobInterfaceID = ${JobInterfaceID}`, (err, result) => {
                console.log(result.recordset)
            })
        } catch (err) {
            uploadMdl.ErrorLog("36548769", err)
        }
        */

        /*
        try {
            sql.connect("mssql://" + cfg.AppBdd.Login + ":" + cfg.AppBdd.Password + "@" + cfg.AppBdd.Uri + "/" + cfg.AppBdd.DataBase)
            var result = sql.query`SELECT TOP 1 * FROM dsi_hlp_JobInterface WHERE JobInterfaceID = ${JobInterfaceID}`
            console.dir(result)
        } catch (err) {
            uploadMdl.ErrorLog("36548769", err)
        }
        */

        /*
        sql.connect(cfg.AppBdd.config).then(pool => {
            return pool.request()
            .input("JobInterfaceID", sql.Int, JobInterfaceID)
            .query("SELECT TOP 1 * FROM dsi_hlp_JobInterface WHERE JobInterfaceID = @JobInterfaceID")
        }).then(result => {
            console.log(result)
        }).catch(err => { uploadMdl.ErrorLog("36548769", err) })
        sql.on('error', err => { uploadMdl.ErrorLog("36548769", err) })
        */
    }
    
    SoketIoEmet() {
        /*
        npm install socket.io-client
        var socket = io.connect('http://example.com');
        socket.on('connect', function () {
            // socket connected
            socket.emit('server custom event', { my: 'data' });
        });
        */
        return true;
    }

    static ArchiveExtract(FileDir, FileName, callback) {
        
        var path = require('path');
        var fs = require('fs');
        var FileLocation = path.join(FileDir, FileName);
        var FolderRootFlg = true;
        var StreamZip = require('node-stream-zip');
        var zip = new StreamZip({
            file: FileLocation,
            storeEntries: true
        });
        zip.on('entry', entry => {
            if (entry.name == "jobInfo.properties") { FolderRootFlg = false; }
        });
        zip.on('ready', function() {

            // Creat unzip folder if no root folder into zip file
            var UnzipFolder = FileDir;
            if (!FolderRootFlg) {
                var JobFolderName = FileName.split(".")[0];
                UnzipFolder = path.join(FileDir, "/" + JobFolderName + "/");
                if (!fs.existsSync(UnzipFolder)) { fs.mkdirSync(UnzipFolder); }
            }

            // Unzip file
            var extract = require('extract-zip');
            extract(FileLocation, { dir: UnzipFolder }, function (err) { uploadMdl.ErrorLog("5254785", err) });
        });
        
        /*
        var FileNameTemp = "";
        var unzip = require('unzip-stream');
        fs.createReadStream(FileLocation)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            var fileName = entry.path;
            var type = entry.type; // 'Directory' or 'File' 
            //var size = entry.size;
        });
        */

        /* Décompression
        var extract = require('extract-zip');
        extract(FileLocation, { dir: form.uploadDir }, function (err) {
            console.log("ERROR", err);
        });
        */

        /* Compression
        var zlib = require('zlib');
        var gzip = zlib.createGzip();
        var inp = fs.createReadStream(FileLocation);
        var out = fs.createWriteStream(FileLocation + '.gz');
        inp.pipe(gzip).pipe(out);
        */

        /*
        var JobArchiveNew = new AdmZip();
        JobArchiveNew.addLocalFolder(UnzipFolder);
        JobArchiveNew.writeZip(FileLocation + "New");
        */

        /*
        var zipFolder = require('zip-folder');
        zipFolder(UnzipFolder, FileLocation + "New", function(err) {
            if(err) {
                console.log('oh no!', err);
            } else {
                console.log('Zip Done');
            }
        });
        onSuccess();
        */

        /*
        var EasyZip = require('easy-zip').EasyZip;
        var zip5 = new EasyZip();
        zip5.zipFolder('UnzipFolder',function(){
            zip5.writeToFile(FileLocation + "New");
            onSuccess();
        });
        */
    }

    static ErrorLog(Code, Err) {
        var NowDate = new Date();
        var NowHour = ('0' + NowDate.getHours()).slice(-2) + ":" + ('0' + NowDate.getMinutes()).slice(-2);
        console.log("[" + NowHour + "][Err][" + Code + "]", Err);
    }

}

module.exports = uploadMdl;
