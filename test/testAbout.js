const about = require('../services/about');
const HttpMocks = require('node-mocks-http');
const should = require('should');

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
      var body = response._getData();
      should(body).have.property('datastoreURL');
      done();
    });

    about.deepPing(request, response);
  });
});
