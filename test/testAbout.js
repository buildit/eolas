const about = require('../services/about');
const http_mocks = require('node-mocks-http');
const should = require('should');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('About Controller Tests', function() {

  it('Test Ping', function(done) {
    var response = buildResponse();
    var request  = http_mocks.createRequest({
      method: 'GET',
      url: '/ping',
    });

    response.on('end', function() {
      var body = JSON.parse(response._getData());
      should(body).have.property('datastore');
      done();
    });

    about.ping(request, response);
  });

  it('Test DeepPing', function(done) {
    var response = buildResponse();
    var request  = http_mocks.createRequest({
      method: 'GET',
      url: '/ping/deep',
    });

    response.on('end', function() {
      var body = response._getData();
      should(body).have.property('datastoreURL');
      done();
    });

    about.deepPing(request, response);
  });
});
