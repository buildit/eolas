const http_mocks = require('node-mocks-http');
const project = require('../services/project');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Project Services Tests', function() {

  // it('Test Get Project Summary', function(done) {
  //   var response = buildResponse();
  //   var request  = http_mocks.createRequest({
  //     method: 'GET',
  //     url: '/project'
  //   });
  //
    // response.on('end', function() {
    //   var body = response._getData();
    //   should(body.length).be.above(1);
    //   should(body[0]).have.property('name');
    //   should(body[0]).have.property('description');
    //   done();
    // });
    //
    // project.getProjectSummary(request, response);
  // });
});
