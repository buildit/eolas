'use strict';

const Config = require('config');
const errorHelper = require('../errors');
const Log4js = require('log4js');
const HttpStatus = require('http-status-codes');
const R = require('ramda');
const Rest = require('restler');
const utils = require('../../util/utils');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

//  Sample Data from Harvest
//
// "project":
// {
//     "id": 10281464,
//     "client_id": 4314423,
//     "name": "CD CI Phase 2",
//     "code": "",
//     "active": true,
//     "billable": true,
//     "bill_by": "People",
//     "hourly_rate": null,
//     "budget": 1528,
//     "budget_by": "project_cost",
//     "notify_when_over_budget": false,
//     "over_budget_notification_percentage": 80,
//     "over_budget_notified_at": null,
//     "show_budget_to_all": true,
//     "created_at": "2016-03-15T13:23:04Z",
//     "updated_at": "2016-04-16T16:36:16Z",
//     "starts_on": "2016-02-17",
//     "ends_on": "2016-05-18",
//     "estimate": 1528,
//     "estimate_by": "project_cost",
//     "hint_earliest_record_at": "2016-02-15",
//     "hint_latest_record_at": "2016-05-13",
//     "notes": "TRACE : OPP000138239  CRM: 50111504",
//     "cost_budget": 191815,
//     "cost_budget_include_expenses": false
// }
//
// "client":
// {
//     "id": 4314426,
//     "name": "Allied Irish Bank",
//     "active": true,
//     "currency": "Euro - EUR",
//     "highrise_id": null,
//     "cache_version": 1276538166,
//     "updated_at": "2016-03-22T13:04:17Z",
//     "created_at": "2016-03-15T13:09:48Z",
//     "statement_key": "1b40efb65f8918651d304b3bce662001",
//     "default_invoice_kind": null,
//     "default_invoice_timeframe": null,
//     "address": "",
//     "currency_symbol": "€",
//     "details": "",
//     "last_invoice_kind": null
// }

const makePretty = ({project}) => ({
  name: project.name,
  portfolio: project.client_id,
  startDate: project.starts_on,
  endDate: project.ends_on,
  description: project.notes,
  externalReference: project.id
});
const isBillable = ({project}) => project.billable === true;
const isActive = ({project}) => project.active === true;

exports.getAvailableProjectList = function() {
  logger.info('getAvailableProjectList');

  return new Promise(function (resolve, reject) {
    getClientList()
      .then(function (clients) {
        getProjectList()
          .then(function (projects) {
            projects.forEach(function(aProject) {
              aProject.portfolio = clients[aProject.portfolio];
            });
            logger.debug(`total available projects -> ${projects.length}`);
            resolve(projects);
          })
          .catch(function (reason) {
            reject(reason);
          });
      })
      .catch(function (reason) {
        reject(reason);
      });
  });
}


function getProjectList () {
  logger.info('getProjectList');

  var harvestURL = Config.get('projectSource.url') + 'projects';
  return new Promise(function (resolve, reject) {
    Rest.get(harvestURL,
      {headers: utils.createBasicAuthHeader(Config.get('projectSource.encodedUser'))}
      ).on('complete', function(data, response) {

        logger.debug(`complete`);

        if (response && response.statusCode !== 200){
          logger.error(`FAIL: ${response.statusCode} MESSAGE ${response.statusMessage}`);
          reject(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving project list'));
        }

        logger.debug(`getAvailableProjectList -> from Harvest -  ${response.statusCode} reading ${data.length} projects`);

        if (data.length < 1) {
          logger.debug('getAvailableProjectList -> Not Found');
          reject(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Unable to find availabe projects'));
        } else {
          const availableProjects = R.pipe(
            R.filter(isBillable),
            R.filter(isActive),
            R.map(makePretty)
          )(data);

          logger.debug(`Billable and Active project count - ${availableProjects.length}`);

          if (availableProjects.length < 1) {
            logger.debug('getAvailableProjectList -> No Active / Billable projects found');
            reject(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'No projects are availabe at this time.'));
          } else {
            resolve(availableProjects);
          }
        }
      }).on('fail', function(data, response) {
        logger.debug('getAvailableProjectList -> FAIL');
        logger.error(`FAIL: ${response.statusCode} - MESSAGE ${data.errorMessages}`);
        reject(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find availabe projects'));
      }).on('error', function(data, response) {
        logger.debug('getAvailableProjectList -> ERROR');
        logger.error(`FAIL: ${response.statusCode} - MESSAGE ${data.errorMessages}`);
        reject(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find availabe projects'));
      });
  });
}

function getClientList () {
  logger.info('getClientList');
  const harvestURL = Config.get('projectSource.url') + 'clients';

  return new Promise(function (resolve, reject) {
    Rest.get(harvestURL,
      {headers: utils.createBasicAuthHeader(Config.get('projectSource.encodedUser'))}
      ).on('complete', function(data, response) {

        if (response && response.statusCode !== 200){
          logger.error(`FAIL: ${response.statusCode} MESSAGE ${response.statusMessage}`);
          reject(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving client list'));
        }

        logger.debug(`getClientList -> from Harvest - ${response.statusCode} reading ${data.length} client`);

        if (data.length < 1) {
          logger.debug('getClientList -> Not Found');
          reject(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Unable to find clients'));
        } else {
          const availableClients = {};

          data.forEach(function(aClient) {
            if (aClient.client.active === true) {
              availableClients[aClient.client.id] = aClient.client.name;
            }
          });

          var numClients = Object.keys(availableClients).length
          logger.debug(`Active Client Count - ${numClients}`);

          if (numClients < 1) {
            logger.debug('getClientList -> No Active clients found');
            reject(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'No clients are availabe at this time.'));
          } else {
            resolve(availableClients);
          }
        }
      }).on('fail', function(data, response) {
        logger.debug('getClientList -> FAIL');
        logger.error(`FAIL: ${response.statusCode} - MESSAGE ${data.errorMessages}`);
        reject(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find availabe clients'));
      }).on('error', function(data, response) {
        logger.debug('getClientList -> ERROR');
        logger.error(`FAIL: ${response.statusCode} - MESSAGE ${data.errorMessages}`);
        reject(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find availabe clients'));
      });
  });
}

/* eslint-disable no-unused-vars */
exports.deepPing = function () {
  logger.info('pingDeep -> Harvest');

  var projectUrl = (Config.get('projectSource.url') + 'account/who_am_i');

  return new Promise(function (resolve, reject) {
    Rest.get(projectUrl,
      {headers: utils.createBasicAuthHeader(Config.get('projectSource.encodedUser'))}
      ).on('success', function(data, response) {

        if (response && response.statusCode !== HttpStatus.OK){
          logger.error(`FAIL: ${response.statusCode} MESSAGE ${response.statusMessage}`);
          resolve (generateConnectionInformation(projectUrl, `pingDeep error from Harvest - ${response.statusCode} MESSAGE ${response.statusMessage}`));
        }

        if (data.length < 1) {
          logger.debug('pingDeep -> Not Found');
          resolve(generateConnectionInformation(projectUrl, 'pingDeep - no data from Harvest'));
        } else {
          resolve(generateConnectionInformation(projectUrl, data.company.name));
        }
      }).on('fail', function(data, response) {
        logger.debug('pingDeep -> FAIL');
        resolve(generateConnectionInformation(projectUrl, `pingDeep error from Harvest - ${response.statusCode} MESSAGE ${data.statusMessage}`));
      }).on('error', function(data, response) {
        logger.error(`pingDeep -> ERROR - data ${data} - response ${response}`);
        resolve(generateConnectionInformation(projectUrl, `pingDeep error from Harvest - ${data}`));
      });
  });
};
/* eslint-enable no-unused-vars */

function generateConnectionInformation(url, info) {
  logger.debug(`ProjectStoreURL : ${url} - ProjectStoreInfo: ${info}`);
  return {ProjectStoreURL : url, ProjectStoreInfo: info};
}
