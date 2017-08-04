const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const project = require('../services/v1/project');
const projectSummary = require('../services/v1/projectSummary');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const UNITTESTPROJECT1 = 'Project Unit Test Project 1';
const UNITTESTPROJECT2 = 'Project Unit Test Project 2';
const PORTFOLIO1 = "One Portfolio TEST";
const PORTFOLIO2 = "Two Portfolio TEST";

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Project Services Summary Array Tests', function() {

  it('Test Create Project', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      originalUrl: '/v1/project',
      params: {'name': UNITTESTPROJECT1},
      body: {
          name: UNITTESTPROJECT1,
          program: "Project Summary Test Data",
          portfolio: PORTFOLIO1,
          description: "A set of basic test data to be used to validate behavior of client systems.",
          startDate: null,
          endDate: null,
          ragStatus: 'green',
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

  it('Test Create Another Project', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      originalUrl: '/v1/project',
      params: {'name': UNITTESTPROJECT2},
      body: {
          name: UNITTESTPROJECT2,
          program: "Project Summary Test Data",
          portfolio: PORTFOLIO2,
          description: "A set of basic test data to be used to validate behavior of client systems.",
          startDate: null,
          endDate: null,
          ragStatus: 'amber',
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

  it('Test Get Project Summary', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      var body = response._getData();
      should(body.length).be.aboveOrEqual(2);
      should(body[0]).not.have.property('_id');
      should(body[0]).have.property('name');
      should(body[0]).have.property('description');
      should(body[0]).have.property('ragStatus');
      done();
    });

    projectSummary.getProjectSummary(request, response);
  });

  it('Test Get Project Summary for a particular portfolio', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET',
      query: {portfolio: PORTFOLIO2}
    });

    response.on('end', function() {
      var body = response._getData();
      should(body.length).equal(1);
      should(body[0]).have.property('name', UNITTESTPROJECT2);
      should(body[0]).have.property('portfolio', PORTFOLIO2);
      done();
    });

    projectSummary.getProjectSummary(request, response);
  });

  it('clean up - Deleteing Project Details', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT1}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      done();
    });

    project.deleteProjectByName(request, response);
  });

  it('clean up - Deleteing Project Details', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT2}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      done();
    });

    project.deleteProjectByName(request, response);
  });
});
