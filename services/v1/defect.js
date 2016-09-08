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

exports.getDefectByName = function (req, res) {
  logger.debug("getDefectByName");
  var projectName = decodeURIComponent(req.params.name);

  co(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var aDefect = yield col.find({name: projectName}, {_id: 0, defect: 1}).toArray();
    db.close();
    logger.debug(JSON.stringify(aDefect));

    if (aDefect.length < 1) {
      logger.debug("getDefectByName - Not Found");
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Unable to find project ' + projectName));
    } else {
      res.send(aDefect[0]);
    }
  }).catch(function(err) {
    logger.debug("getDefectByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find project ' + projectName));
  });
};
