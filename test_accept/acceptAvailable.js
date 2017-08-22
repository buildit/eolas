const config = require('config');
const chakram = require('chakram');
const expect = chakram.expect;
const log4js = require('log4js');
const HttpStatus = require('http-status-codes');
const utils = require('../util/utils');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.level = config.get('log-level');

var A_PROJECT = {
    name: "ACCEPTANCETESTPROJECT",
    program: "Demand Resource Acceptance Test",
    portfolio: "TESTPORTFOLIO",
    description: "A set of basic test data to be used to validate behavior of client systems.",
    startDate: null,
    endDate: null,
    demand: {},
    defect: {},
    effort: {},
    projection: {}};

var projectNameUnderTest = "";
var numberOfAvailaleProjects = 0;

describe("Testing Bad Status Request ", function() {
  var aResponse;

  before("create project", function () {
    aResponse = chakram.get(utils.generateServiceUrlWithQuery('status=bob'))
  });

  it("should return BAD_REQUEST", function () {
      return expect(aResponse).to.have.status(HttpStatus.BAD_REQUEST);
  });
});

describe("Testing GET of an available project list", function() {
    it("should get something", function () {
      this.timeout(5000);
      return chakram.get(utils.generateServiceUrlWithQuery('status=available'))
       .then(function (aResponse) {
         var aBody = JSON.parse(JSON.stringify(aResponse.body));
         expect(aBody.length).to.be.above(0);
         projectNameUnderTest = aBody[0].name;
         numberOfAvailaleProjects = aBody.length;
       });
    });
});

describe("create a project based on the available project list ", function () {
  var createResponse;

  before("create A project from the list of available projects", function () {
    A_PROJECT.name = projectNameUnderTest;
    createResponse = chakram.post(utils.generateServiceUrl(projectNameUnderTest), A_PROJECT);
    return createResponse;
  });

  it('creating a project', function () {
    expect(createResponse).to.have.status(HttpStatus.CREATED);
  });
});

describe("Testing GET of an available project list", function() {
    it("there should be 1 less project available", function () {
      this.timeout(5000);
      return chakram.get(utils.generateServiceUrlWithQuery('status=available'))
       .then(function (aResponse) {
         var aBody = JSON.parse(JSON.stringify(aResponse.body));
         expect(aBody.length).to.equal(numberOfAvailaleProjects - 1);
       });
    });
});

describe("remove project", function() {
  var deleteResponse;

  before("delete project", function () {
    deleteResponse = chakram.delete(utils.generateServiceUrl(projectNameUnderTest));
  });

  it("should return 200 on success", function () {
      return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });
});
