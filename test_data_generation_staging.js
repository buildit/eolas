const fs = require('fs');
const runScript = require('./runScript');

const Log4js = require('log4js');
const Config = require('config');
Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.setLevel(Config.get('log-level'));

const configPath = './config/development.json';
const config = require('./config/development.json');
const oldConfigStringified = JSON.stringify(config);

config.datastore.dbUrl = 'mongodb://mongodb.riglet:27017';
config.datastore.context = 'staging';
const configStringified = JSON.stringify(config);

fs.writeFile(
  configPath,
  configStringified, error => {
  if (error) throw error;
  logger.info('Saved new config.');
  runScript(`./generateTestData`, function (err) {
    if (err) throw err;
    logger.info('Finished generating test data.');
    fs.writeFile(
      configPath,
      oldConfigStringified, error => {
        if (error) throw error;
        logger.info('Reset config.');
      }
    )
  });
})
