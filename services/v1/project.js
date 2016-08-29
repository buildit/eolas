'use strict'

const co = require('co');
const config = require('config');
const HttpStatus = require('http-status-codes');
const log4js = require('log4js');
const MongoClient = require('mongodb');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

exports.getProjectSummary = function (req, res) {
  logger.debug("getProjectSummary");

  var dbUrl = config.get('datastore.dbUrl') + "/buildit";

  co(function*() {
    var db = yield MongoClient.connect(dbUrl);
    var col = db.collection('project');
    var projectList = yield col.find({},
      {_id: 0, name: 1, program: 1, portfolio: 1, status: 1, description: 1}).toArray();
    db.close();
    res.send(projectList);
  }).catch(function(err) {
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send('Error retrieving project list');
  });
};

exports.getByName = function (req, res) {
  logger.debug("getProjectByName ");

  var dbUrl = config.get('datastore.dbUrl') + "/buildit";

  co(function*() {
    var db = yield MongoClient.connect(dbUrl);
    var col = db.collection('project');
    var aProject = yield col.find({name: req.params.name}).toArray();
    db.close();

    if (aProject.length < 1) {
      res.status(HttpStatus.NOT_FOUND);
      res.send('Unable to find project' + req.params.name);
    } else {
      res.send(aProject);
    }
  }).catch(function(err) {
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send('Unable to find project' + req.params.name);
  });
};

exports.createProjectByName = function (req, res) {
  logger.debug("createProjectByName");

  var projectName = req.params.name;
  var project = req.body;

  if (projectName !== project.name) {
    logger.debug("createProjectByName - Missmatched name between URL and BODY");
    res.status(HttpStatus.BAD_REQUEST);
    res.send(`The project id in the request params
       does not match the project id in the request body.
       req.params.p_id: ${JSON.stringify(projectName)}
       req.body.id: project.name`);
  } else {
    var dbUrl = config.get('datastore.dbUrl') + "/buildit";

    co(function*() {
      var db = yield MongoClient.connect(dbUrl);
      var col = db.collection('project');
      var count = yield col.count({name: projectName});
      if (count > 0) {
        logger.debug("createProjectByName - Duplicate Resource");
        db.close();
        res.status(HttpStatus.FORBIDDEN);
        res.send('Project ' + projectName + ' already exists.  Duplicates not permitted');
      }
      var result = yield col.insertOne(project);
      db.close();

      if (result.insertedCount > 0) {
        logger.debug("createProjectByName - Created");
        res.status(HttpStatus.CREATED);
        res.send(req.protocol + '//' + req.hostname + req.originalUrl);
      } else {
        logger.debug("createProjectByName - Project was not created" + projectName);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send('Project ' + projectName + ' unable to create.');
      }
    }).catch(function(err) {
      logger.debug("createProjectByName - ERROR");
      logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send('Unable to create project' + req.params.name);
    });
  }
};

exports.updateProjectByName = function (req, res) {
  logger.debug("updateProjectByName");

  var projectName = req.params.name;
  var project = req.body;

  if (projectName !== project.name) {
    logger.debug("updateProjectByName - Missmatched name between URL and BODY");
    res.status(HttpStatus.BAD_REQUEST);
    res.send(`The project id in the request params
       does not match the project id in the request body.
       req.params.p_id: ${JSON.stringify(projectName)}
       req.body.id: project.name`);
  } else {
    var dbUrl = config.get('datastore.dbUrl') + "/buildit";

    co(function*() {
      var db = yield MongoClient.connect(dbUrl);
      var col = db.collection('project');
      var result = yield col.updateOne({name: projectName}, {$set: project});
      db.close();
      if (result.modifiedCount > 0) {
        res.status(HttpStatus.OK);
        res.send(req.protocol + '//' + req.hostname + req.originalUrl);
      } else {
        logger.debug("updateProjectByName - Project doesn't exist " + projectName);
        res.status(HttpStatus.NOT_FOUND);
        res.send('Project ' + projectName + ' does not exist.  Cannot update.');
      }
    }).catch(function(err) {
      logger.debug("updateProjectByName - ERROR");
      logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send('Unable to update project' + req.params.name);
    });
  }
};

exports.deleteProjectByName = function (req, res) {
  logger.debug("deleteProjectByName");

  var projectName = req.params.name;
  var dbUrl = config.get('datastore.dbUrl') + "/buildit";

  co(function*() {
    var db = yield MongoClient.connect(dbUrl);
    var col = db.collection('project');
    var result = yield col.deleteOne({name: projectName});
    logger.debug("** RESULT");
    logger.debug(result);
    db.close();
    if (result.deletedCount > 0) {
      res.status(HttpStatus.OK);
      res.send('OK');
    } else {
      logger.debug("deleteProjectByName - Project doesn't exist " + projectName);
      res.status(HttpStatus.NOT_FOUND);
      res.send('Project ' + projectName + ' does not exist.  Cannot Delete.');
    }
  }).catch(function(err) {
    logger.debug("deleteProjectByName - ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send('Unable to delete project' + req.params.name);
  });
};
