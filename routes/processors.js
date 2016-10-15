'use strict'

const BodyParser = require('body-parser');
const Config = require('config');
const Express = require('express');
const errorHandler = require('../services/errors');
const Log4js = require('log4js');
const MethodOverride = require('method-override');
const ResponseTime = require('response-time')
const Router = Express.Router();

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.setLevel(Config.get('log-level'));

const appLogger = function (req, res, next) {
  logger.debug("*** HEADERS");
  logger.debug(req.headers);
  logger.debug("*** HEADERS");
  logger.debug("*** BODY");
  logger.debug(JSON.stringify(req.body));
  logger.debug("*** BODY");
  logger.info(`${req.method} called on ${req.path} with params ${JSON.stringify(req.params)} and query ${JSON.stringify(req.query)}`);
  next();
};

const originPolicy = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};

Router.use(BodyParser.json());
Router.use(MethodOverride('X-HTTP-Method'));          // Microsoft
Router.use(MethodOverride('X-HTTP-Method-Override')); // Google/GData
Router.use(MethodOverride('X-Method-Override'));      // IBM router.use()
Router.use(ResponseTime());
Router.use(appLogger);
Router.use(Log4js.connectLogger(logger, { level: Log4js.levels.INFO, format: ':method :url' }));
Router.use(originPolicy);
Router.use(errorHandler.logErrors);
Router.use(errorHandler.clientErrorHandler);
Router.use(errorHandler.catchAllHandler);

module.exports = Router;
