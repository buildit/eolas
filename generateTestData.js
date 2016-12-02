const fs = require('fs');
const runScript = require('./runScript');

const Log4js = require('log4js');
const Config = require('config');
Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.setLevel(Config.get('log-level'));

const testDataDirectory = './test_data/';

fs.readdir(testDataDirectory, (error, scripts) => {
  scripts.forEach(script => {
    runScript(`./test_data/${script}`, function (err) {
      if (err) throw err;
      logger.info(`Successfully ran ${script}`);
    });
  })
})
