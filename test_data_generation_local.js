const runScript = require('./runScript');

const Log4js = require('log4js');
const Config = require('config');
Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.setLevel(Config.get('log-level'));

runScript(`./generateTestData`, function (err) {
  if (err) throw err;
  logger.info('Finished generating test data.');
});
