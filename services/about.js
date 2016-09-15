'use strict'

const config = require('config');
const log4js = require('log4js');
const HttpStatus = require('http-status-codes');
const database = require('./mongodb/mongodb');
const project = require('./harvest/harvest');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

exports.ping = function(req, res) {
  logger.debug('ping');
  res.status(HttpStatus.OK);
  res.json(config);
};

exports.deepPing = function (req, res) {
  logger.debug('pingDeep');

 var externalInfo = {};

  database.deepPing()
    .then(function (databaseResult){
      project.deepPing()
        .then(function (projectResult){
          externalInfo["DataStore"] = databaseResult;
          externalInfo["ProjectSource"] = projectResult;
          res.status(HttpStatus.OK);
          res.json(externalInfo);
        })
        .catch(function (reason) {
          logger.debug(`Problem processing Project for Deep Ping ${reason}`);
          logger.debug(externalInfo);
          res.status(HttpStatus.OK);
          res.send(reason);
        });
      })
    .catch(function (reason) {
      logger.debug(`Problem processing Datastore connection for Deep Ping ${reason}`);
      res.status(HttpStatus.OK);
      res.send(externalInfo);
    });
};
