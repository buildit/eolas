const chakram = require('chakram');

before("configure chakram client",() => {
  const reqOptions = {headers: {"X-User": "acceptance test"}}
  chakram.setRequestDefaults(reqOptions)
});