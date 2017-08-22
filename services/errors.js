'use strict'

const Config = require('config');
const Log4js = require('log4js');
const HttpStatus = require('http-status-codes');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

exports.logErrors = function(err, req, res, next) {
  logger.error("#### An Error occured \n" + err.stack);
  next(err);
}

exports.clientErrorHandler = function(err, req, res, next) {
  if (req.xhr) {
    logger.error("**** A Client error occured \n" + req.xhr);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(this.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'A client error.  Not really sure what happened.  Tell somebody and have a look at the logs.'));
  } else {
    next(err);
  }
}

/* eslint-disable no-unused-vars */
exports.catchAllHandler = function(err, req, res, next) {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR);
  res.send(this.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Bad things.  Not really sure what happened.  Tell somebody and have a look at the logs.'));
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
exports.errorBody = function(code, description) {
  var errorBody = {error: { statusCode: code, message: description}};
  return (errorBody);
}
/* eslint-enable no-unused-vars */
