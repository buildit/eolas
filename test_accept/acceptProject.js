const config = require('config');
const chakram = require('chakram');
const expect = chakram.expect;
const HttpStatus = require('http-status-codes');

const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const ACCEPTANCETESTPROJECT = 'AcceptanceTestProject';
const NOPROJECT = 'ShouldNotExistProject';
const TESTPORTFOLIO = 'A Portfolio';
const UPDATEDPORTFOLIO = 'Updated Portfolio';

var url;
var aProject = {
    name: ACCEPTANCETESTPROJECT,
    program: "Basic Test Data",
    portfolio: TESTPORTFOLIO,
    description: "A set of basic test data to be used to validate behavior of client systems.",
    startDate: null,
    endDate: null,
    demand: [],
    defect: [],
    effort: [],
    projection: {}};

function generateUrl(projectName) {
  var url = 'http://' + config.get('server.url') + ':' + config.get('server.port') + '/v1/project/' + projectName;
  logger.debug(url);
  return url;
};


describe("Testing Create Project ", function() {
  var createResponse;

  before("create project", function () {
//    chakram.delete(generateUrl(ACCEPTANCETESTPROJECT));
    createResponse = chakram.post(generateUrl(ACCEPTANCETESTPROJECT), aProject);
  });

  after("remove created project", function () {
//    chakram.delete(generateUrl(ACCEPTANCETESTPROJECT));
  });

  it("should return 201 on success", function () {
      return expect(createResponse).to.have.status(HttpStatus.CREATED);
  });

  it("should return a URL on success", function () {
      return expect(createResponse).to.have.json('url', 'http://localhost/v1/project/AcceptanceTestProject');
  });
});

describe("Testing Create Duplicate Project ", function() {
  var createResponse;

  before("create project", function () {
//    chakram.post(generateUrl(ACCEPTANCETESTPROJECT), aProject);
    createResponse = chakram.post(generateUrl(ACCEPTANCETESTPROJECT), aProject);
  });

  after("remove created project", function () {
//    chakram.delete(generateUrl(ACCEPTANCETESTPROJECT));
  });

  it("should return FORBIDDEN", function () {
      return expect(createResponse).to.have.status(HttpStatus.FORBIDDEN);
  });
});

describe("Testing Create Bad Request Project ", function() {
  var createResponse;

  before("create project", function () {
    createResponse = chakram.post(generateUrl(NOPROJECT), aProject);
  });

  it("should return BAD_REQUEST", function () {
      return expect(createResponse).to.have.status(HttpStatus.BAD_REQUEST);
  });
});

describe("Testing Get Project ", function() {
  var getResponse;

  before("create project", function () {
    getResponse = chakram.get(generateUrl(ACCEPTANCETESTPROJECT));
  });

  it("should return 200 on success", function () {
      return expect(getResponse).to.have.status(HttpStatus.OK);
  });

  it("should return a project array with 1 entry", function () {
    return expect(getResponse).to.have.json(function(projectArray) {
      expect(projectArray).to.have.length(1)
    });
  });

  it("should return a project array with the project I asked for", function () {
    return expect(getResponse).to.have.json(function(projectArray) {
      var aProject = projectArray[0];
      expect(aProject.name).to.equal(ACCEPTANCETESTPROJECT);
    });
  });
});

describe("Testing Get a non-existant Project ", function() {
  var getResponse;

  before("create project", function () {
    getResponse = chakram.get(generateUrl(NOPROJECT));
  });

  it("should return not found on success", function () {
      return expect(getResponse).to.have.status(HttpStatus.NOT_FOUND);
  });
});

describe("Testing Update Project ", function() {
  var updateResponse;

  before("create project", function () {
    var updatedProject = aProject;
    updatedProject.portfolio = UPDATEDPORTFOLIO;
//    chakram.post(generateUrl(ACCEPTANCETESTPROJECT), aProject);
    updateResponse = chakram.put(generateUrl(ACCEPTANCETESTPROJECT), updatedProject);
  });

  after("remove created project", function () {
//    chakram.delete(generateUrl(ACCEPTANCETESTPROJECT));
  });

  it("should return 200 on success", function () {
      return expect(updateResponse).to.have.status(HttpStatus.OK);
  });

  it("should return a URL on success", function () {
      return expect(updateResponse).to.have.json('url', 'http://localhost/v1/project/AcceptanceTestProject');
  });

  it("should return the updated portfolio", function () {
    getResponse = chakram.get(generateUrl(ACCEPTANCETESTPROJECT));
    return expect(getResponse).to.have.json(function(projectArray) {
      var aProject = projectArray[0];
      expect(aProject.portfolio).to.equal(UPDATEDPORTFOLIO);
    });

  });
});

describe("Testing Update Bad Request Project ", function() {
  var updateResponse;

  before("create project", function () {
    updateResponse = chakram.put(generateUrl(NOPROJECT), aProject);
  });

  it("should return BAD_REQUEST", function () {
      return expect(updateResponse).to.have.status(HttpStatus.BAD_REQUEST);
  });
});

describe("Testing Delete Project ", function() {
  var deleteResponse;

  before("create project", function () {
//    chakram.post(generateUrl(ACCEPTANCETESTPROJECT), aProject);
    deleteResponse = chakram.delete(generateUrl(ACCEPTANCETESTPROJECT));
  });

  it("should return 200 on success", function () {
      return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });
});

describe("Testing Delete non-existant Project ", function() {
  var deleteResponse;

  before("create project", function () {
    deleteResponse = chakram.delete(generateUrl(NOPROJECT));
  });

  it("should return NOT_FOUND on success", function () {
      return expect(deleteResponse).to.have.status(HttpStatus.NOT_FOUND);
  });
});
