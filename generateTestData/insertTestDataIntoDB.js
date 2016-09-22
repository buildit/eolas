const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const utils = require('../util/utils');

const data = require('./data/test-2016-09-22T11:36:21-04:00-demand.json')
const project = require('./project.json')

const now = moment().format('YYYY-MM-DD-hh:mm:ss')
project.name = 'test-' + now
project._id = 'test-' + now
project.id = 'test-' + now

console.log(project);

MongoClient.connect(utils.dbCorePath(), function (err, db) {
  assert.equal(null, err);
  var col = db.collection('project');
  col.findOneAndReplace(
    { name: project.name },
    project,
    { upsert: true },
    function (error, doc) {
      assert.equal(null, error);
      assert.equal(1, doc.lastErrorObject.n);
      db.close();
    }
  );
});
