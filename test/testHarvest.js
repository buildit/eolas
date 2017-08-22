const harvest = require('../services/projectSource/harvest');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.level = config.get('log-level');

describe('Harvest Tests', function() {
  it('Test Get Project List', function() {
    this.timeout(5000);

    return harvest.getAvailableProjectList()
      .then(function(response) {
        should(response.length).be.above(0);
      })
      .catch(function (reason) {
        logger.debug(`failed ${reason}`);
        should.ok(false);
      });
  });
});
