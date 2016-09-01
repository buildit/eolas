'use strict'

const express = require('express');
const router = express.Router();
const about = require('../services/about');
const apiDocs = require('../services/swaggerDoc');
const project = require('../services/v1/project');
const demand = require('../services/v1/demand');

router.get('/ping', about.ping);
router.get('/ping/deep', about.deepPing);
router.get('/doc', apiDocs.serveDoc);

router.get('/project', project.getProjectSummary);
router.get('/project/:name', project.getProjectByName);
router.put('/project/:name', project.updateProjectByName);
router.post('/project/:name', project.createProjectByName);
router.delete('/project/:name', project.deleteProjectByName);

router.get('/project/:name/demand', demand.getDemandByName);

module.exports = router;
