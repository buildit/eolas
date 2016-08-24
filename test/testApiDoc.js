const apiDocs = require('../api_doc/swaggerDoc');
const http_mocks = require('node-mocks-http');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Doc Controller Tests', function() {

  it('Test Doc Not Found', function(done) {
    var response = buildResponse();
    var request  = http_mocks.createRequest({
      method: 'GET',
      url: '/v0/doc'
    });

    response.on('end', function() {
      response._getData().should.equal('Unable to find api doc.');
      done();
    });

    apiDocs.serveDoc(request, response);
  });

  it('Test Serve API Doc', function(done) {
    var response = buildResponse();
    var request  = http_mocks.createRequest({
      method: 'GET',
      url: '/v1/doc'
    });

    response.on('end', function() {
      response._getData().should.not.equal('Unable to find api doc.');
      done();
    });

    apiDocs.serveDoc(request, response);
  });
});
