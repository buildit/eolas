'use strict'

const express = require('express');
const router = express.Router();
const about = require('../services/about');
const apiDocs = require('../services/swaggerDoc');
const project = require('../services/v1/project');

router.get('/ping', about.ping);
router.get('/ping/deep', about.deepPing);
router.get('/doc', apiDocs.serveDoc);

router.get('/project', project.getProjectSummary);
router.get('/project/:name', project.getByName);
router.put('/project/:name', project.updateProjectByName);
router.post('/project/:name', project.createProjectByName);
router.delte('/project/:name', project.deleteProjectByName);

module.exports = router;
