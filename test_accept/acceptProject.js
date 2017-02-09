const config = require('config');
const chakram = require('chakram');
const expect = chakram.expect;
const HttpStatus = require('http-status-codes');
const utils = require('../util/utils');

const log4js = require('log4js');
require('./clientConfigurer');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const ACCEPTANCETESTPROJECT = 'ProjectAcceptanceTestProject';
const NOPROJECT = 'ShouldNotExistProject';
const TESTPORTFOLIO = 'Original Portfolio';
const UPDATEDPORTFOLIO = 'Updated Portfolio';

var A_PROJECT = {
    name: ACCEPTANCETESTPROJECT,
    program: "Project Resource Acceptance Test",
    portfolio: TESTPORTFOLIO,
    description: "A set of basic test data to be used to validate behavior of client systems.",
    startDate: null,
    endDate: null,
    demand: [],
    defect: [],
    effort: [],
    projection: {}};

/* eslint-disable no-unused-vars */
describe("Testing Create Project ", function() {
  var createResponse;

  before("create project", function () {
    return chakram.delete(utils.generateServiceUrl(ACCEPTANCETESTPROJECT))
    .then( function(deleteResponse) {
      createResponse = chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    });
  });

  after("remove created project", function () {
    var deleteResponse = chakram.delete(utils.generateServiceUrl(ACCEPTANCETESTPROJECT))
    return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });

  it("should return 201 on success", function () {
      return expect(createResponse).to.have.status(HttpStatus.CREATED);
  });

  it("should return a URL on success", function () {
      return expect(createResponse).to.have.json('url', utils.generatePortlessServiceUrl(ACCEPTANCETESTPROJECT));
  });
});
/* eslint-enable no-unused-vars */

describe("Testing Create Duplicate Project ", function() {
  var createResponse;

  before("create project", function () {
    return chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    .then( function(postResponse) {
      expect(postResponse).to.have.status(HttpStatus.CREATED);
      createResponse = chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    });
  });

  after("remove created project", function () {
    var deleteResponse = chakram.delete(utils.generateServiceUrl(ACCEPTANCETESTPROJECT))
    return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });

  it("should return FORBIDDEN", function () {
      return expect(createResponse).to.have.status(HttpStatus.FORBIDDEN);
  });
});

describe("Testing Create Bad Request Project ", function() {
  var createResponse;

  before("create project", function () {
    createResponse = chakram.post(utils.generateServiceUrl(NOPROJECT), A_PROJECT);
  });

  it("should return BAD_REQUEST", function () {
      return expect(createResponse).to.have.status(HttpStatus.BAD_REQUEST);
  });
});

describe("Testing Get Project ", function() {
  var getResponse;

  before("create and get project", function () {
    return chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    .then( function(postResponse) {
      expect(postResponse).to.have.status(HttpStatus.CREATED);
      getResponse = chakram.get(utils.generateServiceUrl(ACCEPTANCETESTPROJECT));
    });
  });

  after("remove created project", function () {
    var deleteResponse = chakram.delete(utils.generateServiceUrl(ACCEPTANCETESTPROJECT))
    return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });

  it("should return 200 on success", function () {
      return expect(getResponse).to.have.status(HttpStatus.OK);
  });

  it("should return the project I asked for", function () {
    return expect(getResponse).to.have.json('name', ACCEPTANCETESTPROJECT);
  });
});

describe("Testing Get a non-existant Project ", function() {
  var getResponse;

  before("get project", function () {
    getResponse = chakram.get(utils.generateServiceUrl(NOPROJECT));
  });

  it("should return not found on success", function () {
      return expect(getResponse).to.have.status(HttpStatus.NOT_FOUND);
  });
});

describe("Testing Update Project ", function() {
  var updateResponse;

  before("create project and update a project", function () {
    return chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    .then( function(postResponse) {
      expect(postResponse).to.have.status(HttpStatus.CREATED);
      var updatedProject = JSON.parse(JSON.stringify(A_PROJECT));
      updatedProject.portfolio = UPDATEDPORTFOLIO;
      updateResponse = chakram.put(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), updatedProject);
    });
  });

  after("remove created project", function () {
    var deleteResponse = chakram.delete(utils.generateServiceUrl(ACCEPTANCETESTPROJECT))
    return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });

  it("should return 200 on success", function () {
      return expect(updateResponse).to.have.status(HttpStatus.OK);
  });

  it("should return a URL on success", function () {
      return expect(updateResponse).to.have.json('url', utils.generatePortlessServiceUrl(ACCEPTANCETESTPROJECT));
  });

  it("should return the updated portfolio", function () {
    var getResponse = chakram.get(utils.generateServiceUrl(ACCEPTANCETESTPROJECT));
    return expect(getResponse).to.have.json('portfolio', UPDATEDPORTFOLIO);
  });
});

describe("Testing Update Bad Request Project ", function() {
  var updateResponse;

  before("create project", function () {
    updateResponse = chakram.put(utils.generateServiceUrl(NOPROJECT), A_PROJECT);
  });

  it("should return BAD_REQUEST", function () {
      return expect(updateResponse).to.have.status(HttpStatus.BAD_REQUEST);
  });
});

describe("Testing Delete Project ", function() {
  var deleteResponse;

  before("create project", function () {
    return chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    .then( function(postResponse) {
      expect(postResponse).to.have.status(HttpStatus.CREATED);
      deleteResponse = chakram.delete(utils.generateServiceUrl(ACCEPTANCETESTPROJECT));
    });
  });

  it("should return 200 on success", function () {
      return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });
});

describe("Testing Delete non-existant Project ", function() {
  var deleteResponse;

  before("create project", function () {
    deleteResponse = chakram.delete(utils.generateServiceUrl(NOPROJECT));
  });

  it("should return NOT_FOUND on success", function () {
      return expect(deleteResponse).to.have.status(HttpStatus.NOT_FOUND);
  });
});
