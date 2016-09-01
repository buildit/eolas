const config = require('config');
const chakram = require('chakram');
const expect = chakram.expect;
const HttpStatus = require('http-status-codes');

const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const ACCEPTANCETESTPROJECT = 'AcceptanceTestProject';

var DEFECTSEVERITY = [];
DEFECTSEVERITY.push({sequence: 1, name: "Critical", groupWith: 2});
DEFECTSEVERITY.push({sequence: 2, name: "Major", groupWith: 1});
var DEFECTINFO = {
  url: "",
  project: ACCEPTANCETESTPROJECT,
  authPolicy: "None",
  userData: "",
  entryState: "Open",
  exitState: "Resolved",
  severity: DEFECTSEVERITY};

var A_PROJECT = {
    name: ACCEPTANCETESTPROJECT,
    program: "Defect Resource Acceptance Test",
    portfolio: "Portfolio",
    description: "A set of basic test data to be used to validate behavior of client systems.",
    startDate: null,
    endDate: null,
    demand: {},
    defect: DEFECTINFO,
    effort: {},
    projection: {}};

function generateUrl(projectName) {
  var url = 'http://' + config.get('server.url') + ':' + config.get('server.port') + '/v1/project/' + projectName;
  logger.debug(url);
  return url;
}

describe("Testing GET of Project Defect ", function () {
  it("Create a project and then get the demand (and then clean up)", function () {
    return chakram.post(generateUrl(ACCEPTANCETESTPROJECT), A_PROJECT)
    .then(function (createResponse) {
      expect(createResponse).to.have.status(HttpStatus.CREATED);
      return chakram.get(generateUrl(ACCEPTANCETESTPROJECT) + '/defect');
    })
    .then("now get the demand", function (getResponse) {
      expect(getResponse).to.have.status(HttpStatus.OK);
      return expect(getResponse).to.have.json('project', ACCEPTANCETESTPROJECT);
    });
  });

  after("Clean Up", function () {
    var deleteResponse = chakram.delete(generateUrl(ACCEPTANCETESTPROJECT))
    return expect(deleteResponse).to.have.status(HttpStatus.OK);
  });
});
