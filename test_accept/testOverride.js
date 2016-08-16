const chakram = require('chakram');
const expect = chakram.expect;

describe("Testing Method Override", function() {
    it("POST to ping with a GET should respond with echo", function () {
      return chakram.post("http://localhost:6565/ping", {'Hello': 'World'}, {headers: {'X-HTTP-Method-Override': 'GET'}})
       .then(function (pingResponse) {
         var aBody = pingResponse.body;
         expect(aBody).to.contain('echo');
       });
    });
});

describe("Testing Failed Override Message", function() {
  before("call DELETE on ping", function () {
    pingResponse = chakram.post("http://localhost:6565/ping", {'Hello': 'World'}, {headers: {'X-HTTP-Method-Override': 'DELETE'}})
  });

  it("should return 404 ", function () {
      return expect(pingResponse).to.have.status(404);
  });
});
