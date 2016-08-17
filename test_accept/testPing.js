const config = require('config');
const chakram = require('chakram');
const expect = chakram.expect;

var url;

beforeEach(function() {
  url = 'http://' + config.get('server.url') + ':' + config.get('server.port');
});

/* eslint-disable no-undef */
describe("Testing Generic Response Stuff", function() {
  before("call ping", function () {
    url = 'http://' + config.get('server.url') + ':' + config.get('server.port');
    pingResponse = chakram.get(url + '/ping');
  });

  it("should return 200 on success", function () {
      return expect(pingResponse).to.have.status(200);
  });

  it("should return a response time header extention", function () {
    expect(pingResponse).to.have.header('X-Response-Time');
  });

  it("should return a cross domain origin policy", function () {
    expect(pingResponse).to.have.header('Access-Control-Allow-Origin');
  });
});
/* eslint-enable no-undef */

describe("Testing Ping", function() {
    it("service should respond with echo", function () {
      return chakram.get(url + '/ping')
       .then(function (pingResponse) {
         var aBody = pingResponse.body;
         expect(aBody).to.contain('echo');
       });
    });
});

describe("Testing Deep Ping", function() {
    it("service should respond with configuration data", function () {
      return chakram.get(chakram.get(url + '/ping/deep')
       .then(function (pingResponse) {
         expect(pingResponse).to.have.json('log-level', 'DEBUG');
       }));
    });
});
