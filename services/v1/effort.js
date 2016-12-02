'use strict'

const CO = require('co');
const Config = require('config');
const errorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');
const MongoClient = require('mongodb');
const utils = require('../../util/utils');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.setLevel(Config.get('log-level'));

exports.getEffortByName = function (req, res) {
  logger.info('getEffortByName');
  var projectName = decodeURIComponent(req.params.name);

  CO(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var anEffortSystem = yield col.find({name: projectName}, {_id: 0, effort: 1}).toArray();
    db.close();

    if (anEffortSystem.length < 1) {
      logger.debug("getEffortByName -> Not Found");
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find an effort system defined for project ${projectName}`));
    } else {
      res.send(anEffortSystem[0]);
    }
  }).catch(function(err) {
    logger.debug("getEffortByName -> ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, `Unable to find project ${projectName}`));
  });
};
