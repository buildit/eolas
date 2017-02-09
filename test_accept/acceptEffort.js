const config = require('config');
const chakram = require('chakram');
const expect = chakram.expect;
const log4js = require('log4js');
const HttpStatus = require('http-status-codes');
const utils = require('../util/utils');
require('./clientConfigurer');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const ACCEPTANCETESTPROJECT = 'EffortAcceptanceTestProject';
const NOPROJECT = 'ShouldNotExistProject';

var ROLENAMES = [];
ROLENAMES.push({name: "Build", groupWith: null});
ROLENAMES.push({name: "Test", groupWith: null});
var EFFORTINFO = {
  url: "",
  project: ACCEPTANCETESTPROJECT,
  authPolicy: "None",
  userData: "",
  role: ROLENAMES};

var A_PROJECT = {
    name: ACCEPTANCETESTPROJECT,
    program: "Effort Resource Acceptance Test",
    portfolio: "Portfolio",
    description: "A set of basic test data to be used to validate behavior of client systems.",
    startDate: null,
    endDate: null,
    demand: {},
    defect: {},
    effort: EFFORTINFO,
    projection: {}};

describe("Testing GET of Project Effort ", function () {
  it("Create a project and then get the effort (and then clean up)", function () {
    return chakram.post(utils.generateServiceUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    .then(function (createResponse) {
      expect(createResponse).to.have.status(HttpStatus.CREATED);
      return chakram.get(utils.generateServiceUrl(ACCEPTANCETESTPROJECT) + '/effort');
    })
    .then("now get the demand", function (getResponse) {
      expect(getResponse).to.have.status(HttpStatus.OK);
      return expect(getResponse).to.have.json('project', ACCEPTANCETESTPROJECT);
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
    getResponse = chakram.get(utils.generateServiceUrl(NOPROJECT) + '/effort');
  });

  it("should return not found on success", function () {
      return expect(getResponse).to.have.status(HttpStatus.NOT_FOUND);
  });
});
