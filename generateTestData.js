const fs = require('fs');
const runScript = require('./runScript');

const testDataDirectory = './test_data/';

const testDataScripts = fs.readdir(testDataDirectory, (error, scripts) => {
  scripts.forEach(script => {
    runScript(`./test_data/${script}`, function (err) {
      if (err) throw err;
      console.log(`Successfully ran ${script}`);
    });
  })
})
