const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const demand = require('../services/v1/demand');
const project = require('../services/v1/project');
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const UNITTESTPROJECT = 'DemandUnitTestProject';
const NOPROJECT = 'ShouldNotExistProject';

var DEMANDSEQUENCE = [];
DEMANDSEQUENCE.push({sequence: 1, name: "Start"});
DEMANDSEQUENCE.push({sequence: 2, name: "Done"});
var DEMANDINFO = {
  source: "Excel",
  url: "",
  project: UNITTESTPROJECT,
  authPolicy: "None",
  userData: "",
  flow: DEMANDSEQUENCE};

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Demand Configuration Services Tests', function() {

  before('Create Test Project', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      originalUrl: '/v1/project',
      params: {'name': UNITTESTPROJECT},
      body: {
          name: UNITTESTPROJECT,
          program: "Demand Test Data",
          portfolio: "Unit Test Data",
          description: "A set of basic test data to be used to validate behavior of client systems.",
          startDate: null,
          endDate: null,
          demand: DEMANDINFO,
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


  it('Test Get Project Demand', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      var body = response._getData();
      should(body.demand).have.property('project', UNITTESTPROJECT);
      should(body).not.have.property('_id');
      done();
    });

    demand.getDemandByName(request, response);
  });

  it('Test getting Demand and error when Project does not exist', function(done) {
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

    demand.getDemandByName(request, response);
  });
});
