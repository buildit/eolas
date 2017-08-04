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

function getDataSummary (req, res, projectName, collectionName) {
  CO(function*() {
    var db = yield MongoClient.connect(utils.dbProjectPath(projectName));
    var col = db.collection(collectionName);
    var projectSummaryData = yield col.find({}, {_id: 0}).sort({projectDate: 1}).toArray();
    db.close();

    if (projectSummaryData.length < 1) {
      logger.debug('Project Summary Data - Not Found');
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find ${collectionName} for ${projectName}`));
    } else {
      res.send(projectSummaryData);
    }
  }).catch(function(err) {
    logger.debug('Project Summary Data - ERROR');
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, `Unable to find ${collectionName} for ${projectName}`));
  });
}

exports.getDemandDataSummary = function (req, res) {
  logger.debug("getDemandDataSummary");
  var projectName = decodeURIComponent(req.params.name);

  getDataSummary(req, res, projectName, 'dailyDemandSummary');
};

exports.getDefectDataSummary = function (req, res) {
  logger.debug("getDefectDataSummary");
  var projectName = decodeURIComponent(req.params.name);

  getDataSummary(req, res, projectName, 'dailyDefectSummary');
};

exports.getEffortDataSummary = function (req, res) {
  logger.debug("getEffortDataSummary");
  var projectName = decodeURIComponent(req.params.name);

  getDataSummary(req, res, projectName, 'dailyEffortSummary');
};

exports.getRagStatusDataSummary = function (req, res) {
  logger.debug('getRagStatusDataSummary');
  const projectName = decodeURIComponent(req.params.name);

  getDataSummary(req, res, projectName, 'ragStatuses');
}
