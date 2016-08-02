const chakram = require('chakram');
const expect = chakram.expect;

describe("Testing Generic Response Stuff", function() {
  before("call ping", function () {
    pingResponse = chakram.get("http://localhost:6565/ping");
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

describe("Testing Ping", function() {
    it("service should respond with echo", function () {
      return chakram.get("http://localhost:6565/ping")
       .then(function (pingResponse) {
         var aBody = pingResponse.body;
         expect(aBody).to.contain('echo');
       });
    });
});

describe("Testing Deep Ping", function() {
    it("service should respond with configuration data", function () {
      return chakram.get("http://localhost:6565/ping/deep")
       .then(function (pingResponse) {
         expect(pingResponse).to.have.json('log-level', 'DEBUG');
       });
    });
});
