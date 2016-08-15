'use strict'

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const errorHandler = require('../services/errors');
const log4js = require('log4js');
const methodOverride = require('method-override');
const responseTime = require('response-time')
const router = express.Router();

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const appLogger = function (req, res, next) {
  logger.debug("*** HEADERS");
  logger.debug(req.headers);
  logger.debug("*** HEADERS");
  logger.debug("*** BODY");
  logger.debug(JSON.stringify(req.body));
  logger.debug("*** BODY");
  logger.info(req.method + ' called on ' + req.path + ' with params ' + JSON.stringify(req.params) + ' and query' + JSON.stringify(req.query));
  next();
};

const originPolicy = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};

router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({extended: false}));
router.use(methodOverride('X-HTTP-Method'));          // Microsoft
router.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
router.use(methodOverride('X-Method-Override'));      // IBM router.use()
router.use(responseTime());
router.use(appLogger);
router.use(originPolicy);
router.use(errorHandler.logErrors);
router.use(errorHandler.clientErrorHandler);
router.use(errorHandler.catchAllHandler);

module.exports = router;
