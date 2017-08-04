'use strict'

const Express = require('express');
const Router = Express.Router();
const about = require('../services/about');
const apiDocs = require('../services/swaggerDoc');
const project = require('../services/v1/project');
const projectSummary = require('../services/v1/projectSummary');
const demand = require('../services/v1/demand');
const defect = require('../services/v1/defect');
const effort = require('../services/v1/effort');
const event = require('../services/v1/event');
const projection = require('../services/v1/projection');
const summaryData = require('../services/v1/summaryData');

Router.get('/ping', about.ping);
Router.get('/ping/deep', about.deepPing);
Router.get('/doc', apiDocs.serveDoc);

Router.get('/project', projectSummary.getProjectSummary);

Router.get('/project/:name', project.getProjectByName);
Router.put('/project/:name', project.updateProjectByName);
Router.post('/project/:name', project.createProjectByName);
Router.delete('/project/:name', project.deleteProjectByName);
Router.get('/project/:name/demand', demand.getDemandByName);
Router.get('/project/:name/defect', defect.getDefectByName);
Router.get('/project/:name/effort', effort.getEffortByName);
Router.get('/project/:name/event', event.getEventByName);
Router.get('/project/:name/projection', projection.getProjectionByName);
Router.put('/project/:name/projection', projection.updateProjectionByName);

Router.get('/project/:name/demand/summary', summaryData.getDemandDataSummary);
Router.get('/project/:name/defect/summary', summaryData.getDefectDataSummary);
Router.get('/project/:name/effort/summary', summaryData.getEffortDataSummary);
Router.get('/project/:name/ragStatus/summary', summaryData.getRagStatusDataSummary);
module.exports = Router;
