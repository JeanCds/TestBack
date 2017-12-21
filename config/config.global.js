var config = module.exports = {};

config.AppBackPort = 3000;
config.AppFrontUrl = 'http://localhost:8080';
config.env = 'development';
config.hostname = 'dev.example.com';
config.WorkSpaceFolder = 'D:/TalendSource/';

// Bdd Server
config.AppBdd = {};
config.AppBdd.Type = 'MySql';
config.AppBdd.Uri = 'A01SQL-EDI.cdweb.biz';
config.AppBdd.DataBase = 'EDI';
config.AppBdd.Login = 'tluser';
config.AppBdd.Password = 'gop987VB';
config.AppBdd.config = {
    user: 'tluser',
    password: 'gop987VB',
    server: 'A01SQL-EDI.cdweb.biz', 
    database: 'EDI'
}
config.AppBdd.configMySql = {
    user: 'Edihelper_rct',
    password: '1RVn0WjDXSwPchTNumOY',
    host: 'a04mysql.gslb.cdweb.biz', 
    database: 'a08sch001_talend_param_sandbox'
}
