const config = require('config');
const chakram = require('chakram');
const expect = chakram.expect;
const log4js = require('log4js');
const HttpStatus = require('http-status-codes');
const utils = require('../util/utils');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const ACCEPTANCETESTPROJECT = 'ProjectionAcceptanceTestProject';
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

var A_PROJECT = {
    name: ACCEPTANCETESTPROJECT,
    program: "Projection Resource Acceptance Test",
    portfolio: "Portfolio",
    description: "A set of basic test data to be used to validate behavior of client systems.",
    startDate: null,
    endDate: null,
    demand: {},
    defect: {},
    effort: {},
    projection: PROJECTIONINFO}

describe("Testing GET of Project Projection ", function () {
  it("Create a project and then get the projection (and then clean up)", function () {
    return chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    .then(function (createResponse) {
      expect(createResponse).to.have.status(HttpStatus.CREATED);
      return chakram.get(utils.generateServiceUrl(ACCEPTANCETESTPROJECT) + '/projection');
    })
    .then("now get the projection", function (getResponse) {
      expect(getResponse).to.have.status(HttpStatus.OK);
      return expect(getResponse).to.have.json('backlogSize', ORIGINALBACKLOG);
    });
  });

  after("Clean Up", function () {
    var deleteResponse = chakram.delete(utils.generateServiceUrl(ACCEPTANCETESTPROJECT))
    return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });
});

describe("Testing Get Projection for a non-existant Project ", function() {
  var getResponse;

  before("get projection", function () {
    getResponse = chakram.get(utils.generateServiceUrl(NOPROJECT) + '/projection');
  });

  it("should return not found on success", function () {
      return expect(getResponse).to.have.status(HttpStatus.NOT_FOUND);
  });
});

describe("Testing Update a Projection ", function() {
  var updateResponse;

  before("create project and update a projection", function () {
    return chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    .then( function(postResponse) {
      expect(postResponse).to.have.status(HttpStatus.CREATED);
      var updatedProjection = JSON.parse(JSON.stringify(PROJECTIONINFO));
      updatedProjection.backlogSize = UPDATEDBACKLOG;
      updateResponse = chakram.put(utils.generateServiceUrl(ACCEPTANCETESTPROJECT) + '/projection', updatedProjection);
    });
  });

  after("remove created project", function () {
    var deleteResponse = chakram.delete(utils.generateServiceUrl(ACCEPTANCETESTPROJECT))
    return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });

  it("should return 200 on success", function () {
      return expect(updateResponse).to.have.status(HttpStatus.OK);
  });

  it("should return the updated backlog", function () {
    var getResponse = chakram.get(utils.generateServiceUrl(ACCEPTANCETESTPROJECT) + '/projection');
    return expect(getResponse).to.have.json('projection.backlogSize', UPDATEDBACKLOG);
  });
});

describe("Testing Update Bad Request Projection ", function() {
  var updateResponse;

  before("create project", function () {
    updateResponse = chakram.put(utils.generateServiceUrl(NOPROJECT), PROJECTIONINFO);
  });

  it("should return BAD_REQUEST", function () {
      return expect(updateResponse).to.have.status(HttpStatus.BAD_REQUEST);
  });
});
