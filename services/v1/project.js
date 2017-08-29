'use strict'

const CO = require('co');
const Config = require('config');
const R = require('ramda');
const illuminateSystems = require('@buildit/illuminate-systems');
const constants = require('../../util/constants');
const errorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');
const MongoClient = require('mongodb');
const utils = require('../../util/utils');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

exports.getProjectByName = function (req, res) {
  var projectName = decodeURIComponent(req.params.name);
  logger.info(`getProjectByName for ${projectName}`);

  CO(function* () {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var aProject = yield col.find({
      name: projectName
    }, {
      _id: 0
    }).toArray();
    db.close();

    if (aProject.length < 1) {
      logger.debug("getProjectByName - Not Found");
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find project [${projectName}] in ${utils.dbCorePath()}`));
    } else {
      res.send(aProject[0]);
    }
  }).catch(function (err) {
    logger.debug("getProjectByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, `Unable to find project ${projectName}`));
  });
};

exports.createProjectByName = function (req, res) {
  logger.info("createProjectByName");

  var projectName = decodeURIComponent(req.params.name);
  var project = req.body;

  if (projectName !== project.name) {
    logger.debug("createProjectByName - Missmatched name between URL and BODY");
    res.status(HttpStatus.BAD_REQUEST);
    res.send(errorHelper.errorBody(HttpStatus.BAD_REQUEST, `The project id in the request params
       does not match the project id in the request body.
       req.params.p_id: ${JSON.stringify(projectName)}
       req.body.id: ${project.name}`));
  } else {
    CO(function* () {
      var db = yield MongoClient.connect(utils.dbCorePath());
      var col = db.collection('project');
      var count = yield col.count({
        name: projectName
      });
      if (count > 0) {
        logger.debug("createProjectByName -> Duplicate Resource");
        db.close();
        res.status(HttpStatus.FORBIDDEN);
        res.send(errorHelper.errorBody(HttpStatus.FORBIDDEN, 'Project ' + projectName + ' already exists.  Duplicates not permitted'));
      } else {
        var result = yield col.insertOne(project);
        db.close();

        if (result.insertedCount > 0) {
          res.status(HttpStatus.CREATED);
          var tmpBody = '{"url": "' + req.protocol + '://' + req.hostname + req.originalUrl + '"}';
          logger.debug("createProjectByName -> Created @ " + tmpBody);
          res.send(tmpBody);
        } else {
          logger.debug("createProjectByName -> Project was not created" + projectName);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find create ' + projectName));
        }
      }
    }).catch(function (err) {
      logger.debug("createProjectByName - ERROR");
      logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create project ' + projectName));
    });
  }
};

exports.updateProjectByName = function (req, res) {
  logger.info("updateProjectByName");

  var projectName = decodeURIComponent(req.params.name);
  var project = req.body;

  if (projectName !== project.name) {
    logger.debug("updateProjectByName -> Missmatched name between URL and BODY");
    res.status(HttpStatus.BAD_REQUEST);
    res.send(errorHelper.errorBody(HttpStatus.BAD_REQUEST, `The project id in the request params
       does not match the project id in the request body.
       req.params.p_id: ${JSON.stringify(projectName)}
       req.body.id: ${project.name}`));
  } else {
    CO(function* () {
      var db = yield MongoClient.connect(utils.dbCorePath());
      var col = db.collection('project');
      var result = yield col.updateOne({
        name: projectName
      }, {
        $set: project
      });
      db.close();

      if (result.matchedCount > 0) {
        res.status(HttpStatus.OK);
        var tmpBody = '{"url": "' + req.protocol + '://' + req.hostname + req.originalUrl + '"}';
        logger.debug("updateProjectByName - Updated @ " + tmpBody);
        res.send(tmpBody);
      } else {
        logger.debug("updateProjectByName -> Project doesn't exist " + projectName);
        res.status(HttpStatus.NOT_FOUND);
        res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Project ' + projectName + ' does not exist.  Cannot update.'));
      }
    }).catch(function (err) {
      logger.debug("updateProjectByName -> ERROR");
      logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update project ' + projectName));
    });
  }
};

exports.deleteProjectByName = function (req, res) {
  logger.info("deleteProjectByName");

  var projectName = decodeURIComponent(req.params.name);

  CO(function* () {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var result = yield col.deleteOne({
      name: projectName
    });
    db.close();
    if (result.deletedCount > 0) {
      res.status(HttpStatus.OK);
      res.send('OK');
    } else {
      logger.debug("deleteProjectByName - Project doesn't exist " + projectName);
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Project ' + projectName + ' does not exist.  Cannot Delete.'));
    }
  }).catch(function (err) {
    logger.debug("deleteProjectByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to delete project ' + projectName));
  });
};

exports.getProjectValidation = function (req, res) {
  logger.info("deleteProjectByName");
  const projectName = decodeURIComponent(req.params.name);

  CO(function* () {
    const db = yield MongoClient.connect(utils.dbCorePath());
    const col = db.collection('project');
    const aProject = yield col.find({
      name: projectName
    }, {
      _id: 0
    }).toArray();
    db.close();

    if (aProject.length < 1) {
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find project [${projectName}] in ${utils.dbCorePath()}`));
    } else {
      const status = yield module.exports.check(aProject[0], constants);
      res.send(status);
    }
  })
  .catch(function (err) {
    logger.debug("getProjectValidation - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, `Unable to validate project ${projectName}`));
  });
}

exports.validateProject = function (req, res) {
  const payload = JSON.parse(req.query.payload);
  logger.debug("validateProject");

  CO(function* () {
    const status = yield module.exports.check(payload);
    res.send(status);
  })
  .catch(function (err) {
    logger.debug("validateProject - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, `Unable to validate project ${payload.name}`));
  });
}

const systemDefinitionExists = (aSystemDeffiniton) =>
  (R.not(R.isNil(aSystemDeffiniton)) &&
  R.not(R.isEmpty(aSystemDeffiniton)) &&
  R.not(R.isNil(aSystemDeffiniton.source)) &&
  R.not(R.isNil(aSystemDeffiniton.url)));

exports.check = function(aProject) {  
  const promises = [];
  
  if (!systemDefinitionExists(aProject.demand)) {
    promises.push(Promise.resolve({ status: constants.STATUSWARNING, data: illuminateSystems.utils.validationResponseMessageFormat('No Demand Configured') }));
  } else {
    promises.push(illuminateSystems.demand[aProject.demand.source.toLowerCase()].testDemand(aProject, constants));
  }

  if (!systemDefinitionExists(aProject.defect)) {
    promises.push(Promise.resolve({ status: constants.STATUSWARNING, data: illuminateSystems.utils.validationResponseMessageFormat('No Defect Configured') }));
  } else {
    promises.push(illuminateSystems.defect[aProject.defect.source.toLowerCase()].testDefect(aProject, constants));
  }

  if (!systemDefinitionExists(aProject.effort)) {
    promises.push(Promise.resolve({ status: constants.STATUSWARNING, data: illuminateSystems.utils.validationResponseMessageFormat('No Effort Configured') }));
  } else {
    promises.push(illuminateSystems.effort[aProject.effort.source.toLowerCase()].testEffort(aProject, constants));
  }

  return Promise.all(promises)
  .then(([demand, defect, effort]) => ({
    demand,
    defect,
    effort,
  }));
}