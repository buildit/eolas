'use strict'

const Config = require('config');
const Log4js = require('log4js');
const HttpStatus = require('http-status-codes');
const database = require('./dataStore/mongodb');
const project = require('./projectSource/harvest');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.setLevel(Config.get('log-level'));

exports.ping = function(req, res) {
  logger.info('ping');
  res.status(HttpStatus.OK);
  res.json(Config);
};

exports.deepPing = function (req, res) {
  logger.info('pingDeep');

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
