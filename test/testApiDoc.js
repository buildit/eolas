const apiDocs = require('../api_doc/swaggerDoc');
const config = require('config');
const http_mocks = require('node-mocks-http');
const fs = require('fs');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Doc Controller Tests', function() {

  it('Test Doc Not Found', function(done) {
    var response = buildResponse();
    var request  = http_mocks.createRequest({
      method: 'GET',
      url: '/doc',
    });

    var name1 = config.get('apiDocFilePath');
    var name2 = name1 + '.temp';

    response.on('end', function() {
      response._getData().should.equal('Unable to find api doc.');
      fs.renameSync(name2, name1);
      done();
    });

    fs.renameSync(name1, name2);
    apiDocs.serveDoc(request, response);
  });

  it('Test Serve API Doc', function(done) {
    var response = buildResponse();
    var request  = http_mocks.createRequest({
      method: 'GET',
      url: '/doc',
    });

    response.on('end', function() {
      response._getData().should.not.equal('Unable to find api doc.');
      done();
    });

    apiDocs.serveDoc(request, response);
  });
});
