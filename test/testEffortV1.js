const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const effort = require('../services/v1/effort');
const project = require('../services/v1/project');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const UNITTESTPROJECT = 'EffortUnitTestProject';
const NOPROJECT = 'ShouldNotExistProject';

var ROLENAMES = [];
ROLENAMES.push({name: "Build", groupWith: null});
ROLENAMES.push({name: "Test", groupWith: null});
var EFFORTINFO = {
  url: "",
  project: UNITTESTPROJECT,
  authPolicy: "None",
  userData: "",
  role: ROLENAMES};

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Effort Configuration Services Tests', function() {

  before('Create Test Project', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      originalUrl: '/v1/project',
      params: {'name': UNITTESTPROJECT},
      body: {
          name: UNITTESTPROJECT,
          program: "Effort Test Data",
          portfolio: "Unit Test Data",
          description: "A set of basic test data to be used to validate behavior of client systems.",
          startDate: null,
          endDate: null,
          demand: {},
          defect: {},
          effort: EFFORTINFO,
          projection: {}}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.CREATED);
      done();
    });

    project.createProjectByName(request, response);
  });

  after('Delete Project Details', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      done();
    });

    project.deleteProjectByName(request, response);
  });


  it('Test Get Project Effort', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      var body = response._getData();
      should(body.effort).have.property('project', UNITTESTPROJECT);
      done();
    });

    effort.getEffortByName(request, response);
  });

  it('Test getting Effort and error when Project does not exist', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': NOPROJECT}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.NOT_FOUND);
      var body = response._getData();
      should(body.error.statusCode).equal(HttpStatus.NOT_FOUND);
      done();
    });

    effort.getEffortByName(request, response);
  });
});
