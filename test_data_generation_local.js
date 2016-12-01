const runScript = require('./runScript');

runScript(`./generateTestData`, function (err) {
  if (err) throw err;
  console.log('Finished generating test data.');
});
