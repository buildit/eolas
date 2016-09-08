const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const availableProjects = require('../services/v1/availableProjects');
const project = require('../services/v1/project');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Available Project List Service Test', function() {

  var projectNameUnderTest = "";
  var numberOfAvailaleProjects = 0;

  // Okay this is a bit elaborate, but as I don't have MOCKS working ...
  // oh and you need to rely on Mocha to do this in sequence
  // get the list of available projects (should be nearly all of them)
  // create a project using the first 1
  // get the list of available project again
  // the one just created should be missing
  it('Get Available Projects', function(done) {
    this.timeout(5000);
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      var body = response._getData();
      should(body.length).be.above(0);
      projectNameUnderTest = body[0].name;
      numberOfAvailaleProjects = body.length;
      done();
    });

    availableProjects.getAvailableProjects(request, response);
  });

  it('Create a Project from the list of available projects', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      originalUrl: '/v1/project',
      params: {'name': projectNameUnderTest},
      body: {
          name: projectNameUnderTest,
          program: "Available Project List Test Data",
          portfolio: "Unit Test Data",
          description: "A set of basic test data to be used to validate behavior of client systems.",
          startDate: null,
          endDate: null,
          demand: {},
          defect: {},
          effort: {},
          projection: {}}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.CREATED);
      done();
    });

    project.createProjectByName(request, response);
  });

  it('Get Available Projects Again', function(done) {
    this.timeout(5000);
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      var body = response._getData();
      should(body.length).be.above(0);
      should(body.length).equal(numberOfAvailaleProjects - 1);
      done();
    });

    availableProjects.getAvailableProjects(request, response);
  });

  after('Delete Project Details', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': projectNameUnderTest}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      done();
    });

    project.deleteProjectByName(request, response);
  });

});
