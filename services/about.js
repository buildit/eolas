'use strict'

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));


exports.ping = function(req, res) {
  logger.debug('ping');
  res.json('echo');
};

exports.deepPing = function(req, res) {
  logger.debug('pingDeep');
  res.json(config);
};
