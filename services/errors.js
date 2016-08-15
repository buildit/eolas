'use strict'

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));


exports.logErrors = function(err, req, res, next) {
  logger.error("#### An Error occured \n" + err.stack);
  next(err);
}

exports.clientErrorHandler = function(err, req, res, next) {
  if (req.xhr) {
    logger.error("#### A Client error occured \n" + req.xhr);
    res.status(500).send({ error: 'Service unable to respond, please verify the service is running' });
  } else {
    next(err);
  }
}

/* eslint-disable no-unused-vars */
exports.catchAllHandler = function(err, req, res, next) {
  res.status(500).send({ error: 'Service unable to respond, please verify the service is running' });
}
/* eslint-enable no-unused-vars */
