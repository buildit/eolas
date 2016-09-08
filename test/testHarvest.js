// const HttpMocks = require('node-mocks-http');
// const HttpStatus = require('http-status-codes');
// const harvest = require('../services/harvest/harvest');
// const should = require('should');
//
// const config = require('config');
// const log4js = require('log4js');
//
// log4js.configure('config/log4js_config.json', {});
// const logger = log4js.getLogger();
// logger.setLevel(config.get('log-level'));
//
// function buildResponse() {
//   return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
// }
// 
// describe('Harvest Tests', function() {
//   var aPromise;
//
//   it('Test Get Project List', function(done) {
//     this.timeout(5000);
//
//     aPromsie.on('resolve', function(response) {
//       should(response.length).be.above(0);
//       done();
//     });
//
//     aPromise = harvest.getAvailableProjectList();
//   });
//
// });
