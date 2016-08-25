'use strict'

const co = require('co');
const config = require('config');
const log4js = require('log4js');
const MongoClient = require('mongodb');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

exports.getProjectSummary = function (req, res) {
  logger.debug("getProjectSummary");

  var dbUrl = config.get('datastore.dbUrl') + "/buildit";

  co(function*() {
    var db = yield MongoClient.connect(dbUrl);
    var col = db.collection('project');
    var projectList = yield col.find({},
      {_id: 0, name: 1, program: 1, portfolio: 1, status: 1, description: 1}).toArray();
    db.close();
    res.send(projectList);
  }).catch(function(err) {
    logger.error(err);
    res.send('Error retrieving project list');
  });
};
