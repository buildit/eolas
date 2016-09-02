const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const projection = require('../services/v1/projection');
const project = require('../services/v1/project');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const UNITTESTPROJECT = 'ProjectionUnitTestProject';
const NOPROJECT = 'ShouldNotExistProject';
const ORIGINALBACKLOG = 175;
const UPDATEDBACKLOG = 200;

var PROJECTIONINFO = {
     iterationLength: 2,
     backlogSize: ORIGINALBACKLOG,
     targetVelocity: 20,
     darkMatterPercentage: 10,
     startIterations: 3,
     startVelocity: 10,
     endIterations: 2,
     endVelocity: 10
  }

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Projection Configuration Services Tests', function() {

  before('Create Test Project', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      originalUrl: '/v1/project',
      params: {'name': UNITTESTPROJECT},
      body: {
          name: UNITTESTPROJECT,
          program: "Projection Test Data",
          portfolio: "Unit Test Data",
          description: "A set of basic test data to be used to validate behavior of client systems.",
          startDate: null,
          endDate: null,
          demand: {},
          defect: {},
          effort: {},
          projection: PROJECTIONINFO}
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


  it('Test Get Project Projection', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      var body = response._getData();
      should(body.projection).have.property('backlogSize', ORIGINALBACKLOG);
      done();
    });

    projection.getProjectionByName(request, response);
  });

  it('Test getting Projection and error when Project does not exist', function(done) {
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

    projection.getProjectionByName(request, response);
  });

  it('Test Update Projection', function(done) {
    var updatedProjection = JSON.parse(JSON.stringify(PROJECTIONINFO));
    updatedProjection.backlogSize = UPDATEDBACKLOG;
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT},
      body: {updatedProjection}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      done();
    });

    projection.updateProjectionByName(request, response);
  });

});
