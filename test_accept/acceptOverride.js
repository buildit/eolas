const config = require('config');
const chakram = require('chakram');
const expect = chakram.expect;

var url;

beforeEach(function() {
  url = 'http://' + config.get('server.url') + ':' + config.get('server.port');
});

describe("Testing Method Override", function() {
    it("POST to ping with a GET should respond with echo", function () {
      return chakram.post(url + '/ping', {'Hello': 'World'}, {headers: {'X-HTTP-Method-Override': 'GET'}})
       .then(function (pingResponse) {
         var aBody = JSON.stringify(pingResponse.body);
         expect(aBody).to.contain('datastore');
       });
    });
});

describe("Testing Failed Override Message", function() {
  var pingResponse;

  before("call DELETE on ping", function () {
      pingResponse = chakram.post(url + '/ping', {'Hello': 'World'}, {headers: {'X-HTTP-Method-Override': 'DELETE'}})
  });

  it("should return 404 ", function () {
      return expect(pingResponse).to.have.status(404);
  });
});
