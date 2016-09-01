'use strict'

const express = require('express');
const router = express.Router();
const about = require('../services/about');
const apiDocs = require('../services/swaggerDoc');
const project = require('../services/v1/project');
const demand = require('../services/v1/demand');
const defect = require('../services/v1/defect');
const effort = require('../services/v1/effort');

router.get('/ping', about.ping);
router.get('/ping/deep', about.deepPing);
router.get('/doc', apiDocs.serveDoc);

router.get('/project', project.getProjectSummary);
router.get('/project/:name', project.getProjectByName);
router.put('/project/:name', project.updateProjectByName);
router.post('/project/:name', project.createProjectByName);
router.delete('/project/:name', project.deleteProjectByName);

router.get('/project/:name/demand', demand.getDemandByName);
router.get('/project/:name/defect', defect.getDefectByName);
router.get('/project/:name/effort', effort.getEffortByName);

module.exports = router;
