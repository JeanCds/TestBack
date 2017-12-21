var config = require('./config.global');

config.env = 'test';
config.hostname = 'test.example';
config.mongo.db = 'example_test';

module.exports = config;
