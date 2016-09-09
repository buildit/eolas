'use strict'

const co = require('co');
const config = require('config');
const ErrorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const log4js = require('log4js');
const MongoClient = require('mongodb');
const utils = require('../../util/utils');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

exports.getProjectByName = function (req, res) {
  var projectName = decodeURIComponent(req.params.name);
  logger.debug(`getProjectByName for ${projectName}`);

  co(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var aProject = yield col.find({name: projectName}, {_id: 0}).toArray();
    db.close();

    if (aProject.length < 1) {
      logger.debug("getProjectByName - Not Found");
      res.status(HttpStatus.NOT_FOUND);
      res.send(ErrorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find project [${projectName}] in ${utils.dbCorePath()}`));
    } else {
      res.send(aProject[0]);
    }
  }).catch(function(err) {
    logger.debug("getProjectByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(ErrorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find project ' + projectName));
  });
};

exports.createProjectByName = function (req, res) {
  logger.debug("createProjectByName");

  var projectName = decodeURIComponent(req.params.name);
  var project = req.body;

  if (projectName !== project.name) {
    logger.debug("createProjectByName - Missmatched name between URL and BODY");
    res.status(HttpStatus.BAD_REQUEST);
    res.send(ErrorHelper.errorBody(HttpStatus.BAD_REQUEST, `The project id in the request params
       does not match the project id in the request body.
       req.params.p_id: ${JSON.stringify(projectName)}
       req.body.id: project.name`));
  } else {
    co(function*() {
      var db = yield MongoClient.connect(utils.dbCorePath());
      var col = db.collection('project');
      var count = yield col.count({name: projectName});
      if (count > 0) {
        logger.debug("createProjectByName - Duplicate Resource");
        db.close();
        res.status(HttpStatus.FORBIDDEN);
        res.send(ErrorHelper.errorBody(HttpStatus.FORBIDDEN, 'Project ' + projectName + ' already exists.  Duplicates not permitted'));
      } else {
        var result = yield col.insertOne(project);
        db.close();

        if (result.insertedCount > 0) {
          res.status(HttpStatus.CREATED);
          var tmpBody = '{"url": "' + req.protocol + '://' + req.hostname + req.originalUrl + '"}';
          logger.debug("createProjectByName - Created @ " + tmpBody);
          res.send(tmpBody);
        } else {
          logger.debug("createProjectByName - Project was not created" + projectName);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.send(ErrorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find create ' + projectName));
        }
      }
    }).catch(function(err) {
      logger.debug("createProjectByName - ERROR");
      logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(ErrorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create project ' + projectName));
    });
  }
};

exports.updateProjectByName = function (req, res) {
  logger.debug("updateProjectByName");

  var projectName = decodeURIComponent(req.params.name);
  var project = req.body;

  if (projectName !== project.name) {
    logger.debug("updateProjectByName - Missmatched name between URL and BODY");
    res.status(HttpStatus.BAD_REQUEST);
    res.send(ErrorHelper.errorBody(HttpStatus.BAD_REQUEST, `The project id in the request params
       does not match the project id in the request body.
       req.params.p_id: ${JSON.stringify(projectName)}
       req.body.id: project.name`));
  } else {
    co(function*() {
      var db = yield MongoClient.connect(utils.dbCorePath());
      var col = db.collection('project');
      var result = yield col.updateOne({name: projectName}, {$set: project});
      db.close();
      if (result.modifiedCount > 0) {
        res.status(HttpStatus.OK);
        var tmpBody = '{"url": "' + req.protocol + '://' + req.hostname + req.originalUrl + '"}';
        logger.debug("updateProjectByName - Updated @ " + tmpBody);
        res.send(tmpBody);
      } else {
        logger.debug("updateProjectByName - Project doesn't exist " + projectName);
        res.status(HttpStatus.NOT_FOUND);
        res.send(ErrorHelper.errorBody(HttpStatus.NOT_FOUND, 'Project ' + projectName + ' does not exist.  Cannot update.'));
      }
    }).catch(function(err) {
      logger.debug("updateProjectByName - ERROR");
      logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(ErrorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update project ' + projectName));
    });
  }
};

exports.deleteProjectByName = function (req, res) {
  logger.debug("deleteProjectByName");

  var projectName = decodeURIComponent(req.params.name);

  co(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var result = yield col.deleteOne({name: projectName});
    db.close();
    if (result.deletedCount > 0) {
      res.status(HttpStatus.OK);
      res.send('OK');
    } else {
      logger.debug("deleteProjectByName - Project doesn't exist " + projectName);
      res.status(HttpStatus.NOT_FOUND);
      res.send(ErrorHelper.errorBody(HttpStatus.NOT_FOUND, 'Project ' + projectName + ' does not exist.  Cannot Delete.'));
    }
  }).catch(function(err) {
    logger.debug("deleteProjectByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(ErrorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to delete project ' + projectName));
  });
};
