const fs = require('fs');
const runScript = require('./runScript');

const configPath = './config/development.json';
const config = require('./config/development.json');
const oldConfigStringified = JSON.stringify(config);

config.datastore.dbUrl = 'mongodb://mongodb.riglet:27017';
config.datastore.context = 'staging';
const configStringified = JSON.stringify(config);

fs.writeFile(
  configPath,
  configStringified, error => {
  if (error) throw error;
  console.log('Saved new config.');
  runScript(`./generateTestData`, function (err) {
    if (err) throw err;
    console.log('Finished generating test data.');
    fs.writeFile(
      configPath,
      oldConfigStringified, error => {
        if (error) throw error;
        console.log('Reset config.');
      }
    )
  });
})
