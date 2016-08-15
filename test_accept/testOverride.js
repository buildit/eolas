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
