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

exports.getEventByName = function (req, res) {
  logger.info('getEventByName');
  var projectName = decodeURIComponent(req.params.name);

  CO(function*() {
    var db = yield MongoClient.connect(utils.dbProjectPath(projectName));
    var col = db.collection('loadEvents');
    var effortArray = yield col.find().toArray();
    db.close();

    if (effortArray.length < 1) {
      logger.debug('getEventByName -> Not Found');
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find events for project ${projectName}`));
    } else {
      res.send(effortArray);
    }
  }).catch(function(err) {
    logger.debug("getEventByName -> ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, `Unable to find project ${projectName}`));
  });
};
