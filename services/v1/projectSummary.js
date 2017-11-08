'use strict'

const available = require('./availableProjects');
const CO = require('co');
const Config = require('config');
const errorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');
const MongoClient = require('mongodb');
const utils = require('../../util/utils');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

exports.getProjectSummary = function (req, res) {
  if (req.query.status === undefined) {
    if (req.query.portfolio === undefined) {
      getProjectSummaryAll(req, res);
    } else {
      getProjectSummaryFiltered(req, res, req.query.portfolio);
    }
  } else if (req.query.status === 'available') {
      available.getAvailableProjects(req, res);
  } else {
    logger.debug(`Unsuported project status - ${req.query.status}`);
    res.status(HttpStatus.BAD_REQUEST);
    res.send(errorHelper.errorBody(HttpStatus.BAD_REQUEST, `Unsuported project status - ${req.query.status}`));
  }
};

function getProjectSummaryAll (req, res) {
  logger.debug('getProjectSummaryAll');

  CO(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var projectList = yield col.find({},
      {_id: 0, name: 1, program: 1, portfolio: 1, status: 1, description: 1}).toArray();
    db.close();
    logger.debug(`${projectList.length} projects found`);
    res.send(projectList);
  }).catch(function(err) {
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving project list'));
  });
}

function getProjectSummaryFiltered (req, res, portfolioName) {
  logger.debug(`getProjectSummaryFiltered portfolio=[${portfolioName}]`);

  CO(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var projectList = yield col.find({portfolio: portfolioName},
      {_id: 0, name: 1, program: 1, portfolio: 1, status: 1, description: 1}).toArray();
    db.close();
    res.send(projectList);
  }).catch(function(err) {
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving project list'));
  });
}
