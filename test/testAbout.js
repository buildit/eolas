const about = require('../services/about');
const HttpMocks = require('node-mocks-http');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.level = config.get('log-level');

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('About Controller Tests', function() {

  it('Test Ping', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      var body = JSON.parse(response._getData());
      logger.debug('PING');
      logger.debug(body);
      should(body).have.property('datastore');
      done();
    });

    about.ping(request, response);
  });

  it('Test DeepPing', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      var body = JSON.parse(response._getData());
      logger.debug('DEEP PING');
      logger.debug(body);
      should(body).have.property('DataStore');
      should(body).have.property('ProjectSource');
      done();
    });

    about.deepPing(request, response);
  });
});
