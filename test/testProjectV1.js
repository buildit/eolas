const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const project = require('../services/v1/project');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const UNITTESTPROJECT = 'UnitTestProject';
const NOPROJECT = 'ShouldNotExistProject';


function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Project Services Tests', function() {

  it('Test Create Project', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      originalUrl: '/v1/project',
      params: {'name': UNITTESTPROJECT},
      body: {
        name: UNITTESTPROJECT,
        program: "Basic Test Data",
        portfolio: "Acceptance Test Data",
        description: "A set of basic test data to be used to validate behavior of client systems.",
        startDate: null,
        endDate: null,
        demand: [],
        defect: [],
        effort: [],
        projection: {}}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.CREATED);
      var body = response._getData();
      logger.debug(body);
      done();
    });

    project.createProjectByName(request, response);
  });

  it('Test Create Duplicate Project - Should Fail', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT},
      body: {
        name: UNITTESTPROJECT,
        program: "Basic Test Data",
        portfolio: "Acceptance Test Data",
        description: "A set of basic test data to be used to validate behavior of client systems.",
        startDate: null,
        endDate: null,
        demand: [],
        defect: [],
        effort: [],
        projection: {}}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.FORBIDDEN);
      var body = response._getData();
      should(body.error.statusCode).equal(HttpStatus.FORBIDDEN);
      done();
    });

    project.createProjectByName(request, response);
  });

  it('Test Missmatched URL & Body on Create - Should Fail', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': NOPROJECT},
      body: {
        name: UNITTESTPROJECT,
        program: "Basic Test Data",
        portfolio: "Acceptance Test Data",
        description: "A set of basic test data to be used to validate behavior of client systems.",
        startDate: null,
        endDate: null,
        demand: [],
        defect: [],
        effort: [],
        projection: {}}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.BAD_REQUEST);
      var body = response._getData();
      should(body.error.statusCode).equal(HttpStatus.BAD_REQUEST);
      done();
    });

    project.createProjectByName(request, response);
  });

  it('Test Get Project Summary', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      var body = response._getData();
      should(body.length).be.above(1);
      should(body[0]).have.property('name');
      should(body[0]).have.property('description');
      done();
    });

    project.getProjectSummary(request, response);
  });

  it('Test Get Project Details', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT}
    });

    response.on('end', function() {
      var body = response._getData();
      should(body[0]).have.property('name', UNITTESTPROJECT);
      done();
    });

    project.getProjectByName(request, response);
  });

  it('Test Getting and error when Project does not exist', function(done) {
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

    project.getProjectByName(request, response);
  });

  it('Test Update Project', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT},
      body: {
        name: UNITTESTPROJECT,
        program: "UPDATED Basic Test Data",
        portfolio: "Acceptance Test Data",
        description: "A set of basic test data to be used to validate behavior of client systems.",
        startDate: null,
        endDate: null,
        demand: [],
        defect: [],
        effort: [],
        projection: {}}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      done();
    });

    project.updateProjectByName(request, response);
  });

  it('Test Update non-existant Project - Should Fail', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': NOPROJECT},
      body: {
        name: NOPROJECT,
        program: "UPDATED Basic Test Data",
        portfolio: "Acceptance Test Data",
        description: "A set of basic test data to be used to validate behavior of client systems.",
        startDate: null,
        endDate: null,
        demand: [],
        defect: [],
        effort: [],
        projection: {}}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.NOT_FOUND);
      var body = response._getData();
      should(body.error.statusCode).equal(HttpStatus.NOT_FOUND);
      done();
    });

    project.updateProjectByName(request, response);
  });

  it('Test Missmatched URL & Body on Update - Should Fail', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': NOPROJECT},
      body: {
        name: UNITTESTPROJECT,
        program: "Basic Test Data",
        portfolio: "Acceptance Test Data",
        description: "A set of basic test data to be used to validate behavior of client systems.",
        startDate: null,
        endDate: null,
        demand: [],
        defect: [],
        effort: [],
        projection: {}}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.BAD_REQUEST);
      var body = response._getData();
      should(body.error.statusCode).equal(HttpStatus.BAD_REQUEST);
      done();
    });

    project.updateProjectByName(request, response);
  });

  it('Test Deleteing Project Details', function(done) {
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

  it('Test Deleteing when Project does not exist', function(done) {
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

    project.deleteProjectByName(request, response);
  });

});
