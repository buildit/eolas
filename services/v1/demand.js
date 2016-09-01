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

exports.getDemandByName = function (req, res) {
  logger.debug("getDemandByName");

  co(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var aDemand = yield col.find({name: req.params.name}, {_id: 0, demand: 1}).toArray();
    db.close();

    if (aDemand.length < 1) {
      logger.debug("getDemandByName - Not Found");
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Unable to find project ' + req.params.name));
    } else {
      res.send(aDemand[0]);
    }
  }).catch(function(err) {
    logger.debug("getDemandByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find project ' + req.params.name));
  });
};
