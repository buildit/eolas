const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const harvest = require('../services/harvest/harvest');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Project Availablity Tests', function() {

  it('Test Get Project List', function(done) {
    this.timeout(5000);
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      done();
    });

    harvest.getAvailableProjectList(request, response);
  });

});
