'use strict'

const express = require('express');
const router = express.Router();
const about = require('../services/about');
const apiDocs = require('../services/swaggerDoc');
const project = require('../services/v1/project');
const projectSummary = require('../services/v1/projectSummary');
const demand = require('../services/v1/demand');
const defect = require('../services/v1/defect');
const effort = require('../services/v1/effort');
const projection = require('../services/v1/projection');
const summaryData = require('../services/v1/summaryData');

router.get('/ping', about.ping);
router.get('/ping/deep', about.deepPing);
router.get('/doc', apiDocs.serveDoc);

router.get('/project', projectSummary.getProjectSummary);

router.get('/project/:name', project.getProjectByName);
router.put('/project/:name', project.updateProjectByName);
router.post('/project/:name', project.createProjectByName);
router.delete('/project/:name', project.deleteProjectByName);
router.get('/project/:name/demand', demand.getDemandByName);
router.get('/project/:name/defect', defect.getDefectByName);
router.get('/project/:name/effort', effort.getEffortByName);
router.get('/project/:name/projection', projection.getProjectionByName);
router.put('/project/:name/projection', projection.updateProjectionByName);

router.get('/project/:name/demand/summary', summaryData.getDemandDataSummary);
router.get('/project/:name/defect/summary', summaryData.getDefectDataSummary);
router.get('/project/:name/effort/summary', summaryData.getEffortDataSummary);

module.exports = router;
