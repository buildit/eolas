'use strict'

const Config = require('config');
const errorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const harvest = require('../projectSource/harvest');
const Log4js = require('log4js');
const MongoClient = require('mongodb');
const projectSummaryArray = require('../../util/projectSummaryArray').ProjectSummaryArray;
const utils = require('../../util/utils');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.setLevel(Config.get('log-level'));

exports.getAvailableProjects = function (req, res) {
  logger.info('getAvailableProjects');

  var projectSource = Config.get('projectSource.system');

  switch(projectSource.toUpperCase()) {
      case "HARVEST":
        harvest.getAvailableProjectList()
          .then(function (currentProjects) {
            getExistingProjectNames()
              .then(function (existingNames){
                var availableProjects = new projectSummaryArray();
                availableProjects.addProjects(currentProjects);
                availableProjects.remove(existingNames);
                res.status(HttpStatus.OK);
                res.send(availableProjects.asJSON());
              })
              .catch(function (reason) {
                logger.error(`Error getting unused Harvest Projects ${reason}`);
                res.status(reason.statusCode);
                res.send(reason);
              });
          })
          .catch(function (reason) {
            logger.debug(`Error getting unused Harvest Projects ${reason}`);
            res.status(reason.statusCode);
            res.send(reason);
          });
          break;
      default:
        logger.debug(`getAvailableProjects - Unknown Project System - ${projectSource}`);
        res.status(HttpStatus.NOT_FOUND);
        res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unknown Project System ${projectSource}`));
  }
};

function getExistingProjectNames() {
  logger.info('getExistingProjectNames');

  return new Promise(function (resolve, reject) {
    MongoClient.connect(utils.dbCorePath(), function (error, db) {
      if (error) {
        logger.error(`FAIL connecting to Mongo: ${error}`);
        reject(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving project list'));
      }
      db.collection('project').find({}, {_id: 0, name: 1}).toArray(function (err, docs) {
        db.close();
        if (err) {
          logger.error(`FAIL reading project collection: ${err}`);
          reject(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving project list'));
        } else {
          resolve(docs);
        }
      });
    });
  });
}
