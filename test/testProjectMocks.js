// const HttpMocks = require('node-mocks-http');
// const HttpStatus = require('http-status-codes');
// const Sinon = require('sinon');
// const SinonPromise = require('sinon-as-promised');
// const project = require('../services/v1/project');
// const should = require('should');
// const MongoClient = require('mongodb');
//
// const config = require('config');
// const log4js = require('log4js');
//
// log4js.configure('config/log4js_config.json', {});
// const logger = log4js.getLogger();
// logger.level = config.get('log-level');
//
// const UNITTESTPROJECT = 'UnitTestProject';
// const NOPROJECT = 'ShouldNotExistProject';
//
//
// function buildResponse() {
//   return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
// }
//
// describe('Project Services Tests', function() {
//
//   it('Test Create Project', function(done) {
//     var response = buildResponse();
//     var request  = HttpMocks.createRequest({
//       params: {'name': UNITTESTPROJECT},
//       body: {
//         name: UNITTESTPROJECT,
//         program: "Basic Test Data",
//         portfolio: "Acceptance Test Data",
//         description: "A set of basic test data to be used to validate behavior of client systems.",
//         startDate: null,
//         endDate: null,
//         demand: [],
//         defect: [],
//         effort: [],
//         projection: {}}
//     });
//     var MongoMock = Sinon.mock(MongoClient);
//     var DBMock = Sinon.mock(MongoClient.Db.prototype);
//     var CollectionMock = Sinon.mock(MongoClient.Collection.prototype);
//     var countResult = 1;
//     var aResult = {result: {insertedCount: 1}};
//     MongoMock.expects('connect').resolves(DBMock);
//     DBMock.expects('collection').returns(CollectionMock);
//     CollectionMock.expects('count').resolves(countResult);
//     CollectionMock.expects('insertOne').resolves(aResult);
//
//     response.on('end', function() {
//       should(response.statusCode).equal(HttpStatus.CREATED);
//       CollectionMock.restore();
//       DBMock.restore();
//       MongoMock.restore();
//       done();
//     });
//
//     project.createProjectByName(request, response);
//   });
//
// });
