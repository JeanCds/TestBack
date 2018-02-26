var express = require('express');
var cors = require("cors");
var compression = require("compression");
var helmet = require("helmet");
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var config = require('./config');

if (config.WorkSpaceFolder !== undefined && config.WorkSpaceFolder !== null) {
  var fs = require('fs')
  var ConfigPath = config.WorkSpaceFolder + 'MyJson.json'
  try {
    var ConfigParsed = JSON.parse(fs.readFileSync(ConfigPath, 'UTF-8'))
    config.Test = ConfigParsed
  }
  catch (err) { }
}

app.use(helmet());
app.use(cors({  
  // origin: [config.AppFrontUrl],
  origin: '*',
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static('C:/TalendSource/Upload/Image/'))

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'))
})

app.post('/api/:Controller/:Methode', function(req, res){
  try {
    res.setHeader('Content-Type', 'application/json')
    var ObjectCtrl = require('./controllers/' + req.params.Controller + '/Ctrl' + req.params.Controller);
    if (typeof ObjectCtrl[req.params.Methode] === "function") {
      res.setHeader('Content-Type', 'application/json')
      ObjectCtrl[req.params.Methode](req, res)
    } 
    else { res.end(JSON.stringify({ success: false, Error: "Unknown methode !" }, null, 3)); }
  }
  catch(error) {
    console.log('error !!!');
    console.log(error);
  }
})

app.post('/upload', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  var CtrlUpload = require('./controllers/CtrlUpload');
  CtrlUpload.UploadFile(req, res);
});

app.use(function(req, res) {
  res.status(404).send({ success: false, err: 'Path not found : ' + req.originalUrl })
});

var server = app.listen(config.AppBackPort, function(){
  console.log('Server listening on port ' + config.AppBackPort);
});
