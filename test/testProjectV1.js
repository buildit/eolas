const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const Sinon = require('sinon');
require('sinon-as-promised');
const should = require('should');
const CO = require('co');
const illuminateSystems = require('@buildit/illuminate-systems');
const config = require('config');
const log4js = require('log4js');
const R = require('ramda');

const constants = require('../util/constants');
const project = require('../services/v1/project');


log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.level = config.get('log-level');

const UNITTESTPROJECT = 'Project Unit Test Project';
const NOPROJECT = 'Should Not Exist Project';

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
          program: "Project Test Data",
          portfolio: "Unit Test Data",
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
          program: "Project Test Data",
          portfolio: "Unit Test Data",
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
          program: "Project Test Data",
          portfolio: "Unit Test Data",
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

  it('Test Get Project Details', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT}
    });

    response.on('end', function() {
      var body = response._getData();
      should(body).not.have.property('_id');
      should(body).have.property('name', UNITTESTPROJECT);
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
          program: "OTHER",
          portfolio: "OTHER",
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

  it('Test Update a Project with no changes', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT},
      body: {
          name: UNITTESTPROJECT,
          program: "OTHER",
          portfolio: "OTHER",
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
          program: "Project Test Data",
          portfolio: "Unit Test Data",
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
          program: "Project Test Data",
          portfolio: "Unit Test Data",
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
    
  describe('check', () => {
    const sandbox = Sinon.sandbox.create();
    before(() => {
      sandbox.stub(illuminateSystems.demand.jira, 'testDemand').resolves({ status: constants.STATUSOK });
      sandbox.stub(illuminateSystems.demand.trello, 'testDemand').resolves({ status: constants.STATUSOK });
      sandbox.stub(illuminateSystems.defect.jira, 'testDefect').resolves({ status: constants.STATUSOK });
      sandbox.stub(illuminateSystems.effort.harvest, 'testEffort').resolves({ status: constants.STATUSOK });
    });
    const baseProject = {
      name: 'A Test Project',
      demand: {
        source: 'Jira',
        url: 'some.url',
      },
      defect: {
        source: 'Jira',
        url: 'some.url',
      },
      effort: {
        source: 'Harvest',
        url: 'some.url',
      }
    }
    
    describe('demand', () => {
      it('passes when there is demand and Jira as a source', () =>
        CO(function* () {
          const result = yield project.check(baseProject);
          should(result.demand.status).equal(constants.STATUSOK);
        })
      );

      it('passes when there is demand and Trello as a source', () =>
        CO(function* () {
          const aProject = R.merge(baseProject, { demand: { source: 'Trello', url: 'some.url' } });
          const result = yield project.check(aProject);
          should(result.demand.status).equal(constants.STATUSOK);
        })
      );

      it('fails if there is no demand', () =>
        CO(function* () {
          const aProject = R.omit(['demand'], baseProject);
          const result = yield project.check(aProject);
          should(result.demand.status).equal(constants.STATUSWARNING);
        })
      );

      it('fails if there is no demand source', () =>
        CO(function* () {
          const aProject = R.merge(baseProject, { demand: { } });
          const result = yield project.check(aProject);
          should(result.demand.status).equal(constants.STATUSWARNING);
        })
      );

      it('fails if the demand source is anything other than "Jira" or "Trello"', () =>
        CO(function* () {
          const aProject = R.merge(baseProject, { demand: { source: 'bad!', url: 'some.url' } });
          const result = yield project.check(aProject);
          should(result.demand.status).equal(constants.STATUSERROR);
        })
      );
    });

    describe('defect', () => {
      it('passes when there is defect and Jira as a source', () =>
        CO(function* () {
          const result = yield project.check(baseProject);
          should(result.defect.status).equal(constants.STATUSOK);
        })
      );

      it('fails if there is no defect', () =>
        CO(function* () {
          const aProject = R.omit(['defect'], baseProject);
          const result = yield project.check(aProject);
          should(result.defect.status).equal(constants.STATUSWARNING);
        })
      );

      it('fails if there is no defect source', () =>
        CO(function* () {
          const aProject = R.merge(baseProject, { defect: { } });
          const result = yield project.check(aProject);
          should(result.defect.status).equal(constants.STATUSWARNING);
        })
      );

      it('fails if the defect source is anything other than "Jira" or "Trello"', () =>
        CO(function* () {
          const aProject = R.merge(baseProject, { defect: { source: 'bad!', url: 'some.url' } });
          const result = yield project.check(aProject);
          should(result.defect.status).equal(constants.STATUSERROR);
        })
      );
    });

    describe('effort', () => {
      it('passes when there is effort and Harvest as a source', () =>
        CO(function* () {
          const result = yield project.check(baseProject);
          should(result.effort.status).equal(constants.STATUSOK);
        })
      );

      it('fails if there is no effort', () =>
        CO(function* () {
          const aProject = R.omit(['effort'], baseProject);
          const result = yield project.check(aProject);
          should(result.effort.status).equal(constants.STATUSWARNING);
        })
      );

      it('fails if there is no effort source', () =>
        CO(function* () {
          const aProject = R.merge(baseProject, { effort: { } });
          const result = yield project.check(aProject);
          should(result.effort.status).equal(constants.STATUSWARNING);
        })
      );

      it('fails if the effort source is anything other than "Harvest"', () =>
        CO(function* () {
          const aProject = R.merge(baseProject, { effort: { source: 'bad!', url: 'some.url' } });
          const result = yield project.check(aProject);
          should(result.effort.status).equal(constants.STATUSERROR);
        })
      );
    });

    after(() => {
      sandbox.restore();
    });
  });

});


