'use strict'

const config = require('config');
const log4js = require('log4js');
const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time')
const router = express.Router();

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const appLogger = function (req, res, next) {
  logger.info(req.method + ' called on ' + req.path + ' with params ' + JSON.stringify(req.params) + ' and query' + JSON.stringify(req.query));
  next();
};

const originPolicy = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};

router.use(responseTime());
router.use(appLogger);
router.use(originPolicy);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

module.exports = router;
