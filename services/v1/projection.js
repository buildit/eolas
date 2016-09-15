'use strict'

const co = require('co');
const config = require('config');
const errorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const log4js = require('log4js');
const MongoClient = require('mongodb');
const utils = require('../../util/utils');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

exports.getProjectionByName = function (req, res) {
  logger.debug("getProjectionByName");
  var projectName = decodeURIComponent(req.params.name);

  co(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var aProjection = yield col.find({name: projectName}, {_id: 0, projection: 1}).toArray();
    db.close();
    logger.debug(JSON.stringify(aProjection));

    if (aProjection.length < 1) {
      logger.debug("getProjectionByName - Not Found");
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Unable to find project ' + projectName));
    } else {
      res.send(aProjection[0]);
    }
  }).catch(function(err) {
    logger.debug("getProjectionByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find project ' + projectName));
  });
};

exports.updateProjectionByName = function (req, res) {
  logger.debug("updateProjectionByName");
  var projectName = decodeURIComponent(req.params.name);
  var projection = req.body;

  co(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var result = yield col.updateOne({name: projectName}, {$set: {projection: projection}});
    db.close();
    if (result.matchedCount > 0) {
      res.status(HttpStatus.OK);
      var tmpBody = '{"url": "' + req.protocol + '://' + req.hostname + req.originalUrl + '"/projection}';
      logger.debug("updateProjectionByName - Updated @ " + tmpBody);
      res.send(tmpBody);
    } else {
      logger.debug("updateProjectionByName - Project doesn't exist " + projectName);
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Project ' + projectName + ' does not exist.  Cannot update.'));
    }
  }).catch(function(err) {
    logger.debug("updateProjectionByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update project ' + projectName));
  });
};
