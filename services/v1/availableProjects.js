'use strict'

const config = require('config');
const ErrorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const Harvest = require('../harvest/harvest');
const log4js = require('log4js');
const MongoClient = require('mongodb');
const ProjectSummaryArray = require('../../util/projectSummaryArray').ProjectSummaryArray;
const utils = require('../../util/utils');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

exports.getAvailableProjects = function (req, res) {
  logger.debug("getAvailableProjects");

  var projectSource = config.get('projectSource.system');

  switch(projectSource) {
      case "Harvest":
        Harvest.getAvailableProjectList()
          .then(function (currentProjects) {
            getExistingProjectNames()
              .then(function (existingNames){
                var availableProjects = new ProjectSummaryArray();
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
            logger.debug('Error getting unused Harvest Projects ' + reason);
            res.status(reason.statusCode);
            res.send(reason);
          });
          break;
      default:
        logger.debug(`getAvailableProjects - Unknown Project System - ${projectSource}`);
        res.status(HttpStatus.NOT_FOUND);
        res.send(ErrorHelper.errorBody(HttpStatus.NOT_FOUND, 'Unknown Project System ' + projectSource));
  }

};

function getExistingProjectNames() {
  logger.debug("getExistingProjectNames");

  return new Promise(function (resolve, reject) {
    MongoClient.connect(utils.dbCorePath(), function (error, db) {
      if (error) {
        logger.error(`FAIL connecting to Mongo: ${error}`);
        reject(ErrorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving project list'));
      }
      db.collection('project').find({}, {_id: 0, name: 1}).toArray(function (err, docs) {
        db.close();
        if (err) {
          logger.error(`FAIL reading project collection: ${err}`);
          reject(ErrorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving project list'));
        } else {
          resolve(docs);
        }
      });
    });
  });
}
