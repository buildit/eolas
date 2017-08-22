'use strict'

const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const MongoClient = require('mongodb');
const projectEvent = require('../services/v1/event');
const project = require('../services/v1/project');
const should = require('should');
const utils = require('../util/utils');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.level = config.get('log-level');

const UNITTESTPROJECT = 'EventUnitTestProject';
const NOPROJECT = 'ShouldNotExistProject';

const SAMPLEEVENTS = [
  {
    _id: 'AN ID 1',
    type: 'LOAD EVENT',
    startTime: '2015-01-10',
    endTime: '2015-01-11',
    since: '2000-01-01',
    status: 'SUCCESS',
    note: 'a note',
    demand: {
      completion: '2015-01-11',
      status: 'SUCCESS',
      message: 'A Message'
    },
    defect: null,
    effort: null
  },
  {
    _id: 'AN ID 2',
    type: 'UPDATE EVENT',
    startTime: '2015-01-12',
    endTime: '2015-01-13',
    since: '2015-01-11',
    status: 'FAILURE',
    note: 'a note',
    demand: {
      completion: '2015-01-13',
      status: 'FAILURE',
      message: 'A Message'
    },
    defect: null,
    effort: null
  }
];

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Event Listing Services Tests', function() {

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

    MongoClient.connect(utils.dbProjectPath(UNITTESTPROJECT), function (err, db) {
      var col = db.collection('loadEvents');
      col.deleteMany({}, function (err, result) {
        if (err) {
          logger.error(`Error deleting events ${JSON.stringify(err)}`);
          db.close();
          should.ok(false);
        } else {
          logger.debug('Events cleared', result);
          db.close();
          should.ok(true);
        }
      });
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      done();
    });

    project.deleteProjectByName(request, response);
  });


  it('Test Get error on Project Event - no events', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.NOT_FOUND);
      var body = response._getData();
      should(body.error.statusCode).equal(HttpStatus.NOT_FOUND);
      done();
    });

    projectEvent.getEventByName(request, response);
  });

  it('Hack - create some sample events', function () {
    MongoClient.connect(utils.dbProjectPath(UNITTESTPROJECT), function (err, db) {
      var col = db.collection('loadEvents');
      col.insertMany(SAMPLEEVENTS, function (err, result) {
        if (err) {
          logger.error(`Error inserting project events ${JSON.stringify(err)}`);
          db.close();
          should.ok(false);
        } else {
          logger.debug('Sample events created', result);
          db.close();
          should.ok(true);
        }
      });
    });
  });

  it('Test Get Project Event', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      params: {'name': UNITTESTPROJECT}
    });

    response.on('end', function() {
      should(response.statusCode).equal(HttpStatus.OK);
      var body = response._getData();
      should(body.length).equal(2);
      done();
    });

    projectEvent.getEventByName(request, response);
  });

  it('Test getting an Event and error when Project does not exist', function(done) {
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

    projectEvent.getEventByName(request, response);
  });
});
