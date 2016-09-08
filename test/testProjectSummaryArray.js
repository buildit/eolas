'use strict'

const ProjectSummaryArray = require('../util/projectSummaryArray').ProjectSummaryArray;
const should = require('should');

const config = require('config');
const log4js = require('log4js');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

describe('Project Summary Array Tests', function() {

  it('Create an Empty Array Ojbect', function(done) {
    var aProjectSummaryArray = new ProjectSummaryArray();
    should(aProjectSummaryArray.size()).equal(0);
    done();
  });

  it('Add a Project', function(done) {
    var aProjectSummaryArray = new ProjectSummaryArray();
    aProjectSummaryArray.addProject('name', 'program', 'portfolio', 'description', 'startDate', 'endDate', 'externalReference');
    should(aProjectSummaryArray.size()).equal(1);
    done();
  });

  it('Add 2 Projects and then remove one', function(done) {
    var aProjectSummaryArray = new ProjectSummaryArray();
    aProjectSummaryArray.addProject('name1', 'program', 'portfolio', 'description', 'startDate', 'endDate', 'externalReference');
    aProjectSummaryArray.addProject('name2', 'program', 'portfolio', 'description', 'startDate', 'endDate', 'externalReference');
    var removeMe = [{name: 'name1'}];
    aProjectSummaryArray.remove(removeMe);
    should(aProjectSummaryArray.size()).equal(1);
    done();
  });

  it('Create from Array', function(done) {
    var projectArray = [ { name: 'CD CI Phase 2',
    portfolio: 'HSBC UK',
    startDate: '2016-02-17',
    endDate: '2016-05-18',
    description: 'TRACE : OPP000138239\r\nCRM: 50111504',
    externalReference: 10281464 },
  { name: 'Tablet MVP',
    portfolio: 'HSBC UK',
    startDate: '2015-12-10',
    endDate: '2016-03-31',
    description: '',
    externalReference: 10322926 },
  { name: 'Wo2 : Transition',
    portfolio: 'Chelsea',
    startDate: '2016-01-05',
    endDate: '2016-04-29',
    description: '',
    externalReference: 10327164 },
  { name: 'Wo4 : CHEF',
    portfolio: 'Chelsea',
    startDate: '2016-02-29',
    endDate: '2016-05-27',
    description: '',
    externalReference: 10345351 }];

    var aProjectSummaryArray = new ProjectSummaryArray();
    aProjectSummaryArray.addProjects(projectArray);
    should(aProjectSummaryArray.size()).equal(projectArray.length);
    done();
  });

  it('Remove Array', function(done) {
    var projectArray = [ { name: 'CD CI Phase 2',
    portfolio: 'HSBC UK',
    startDate: '2016-02-17',
    endDate: '2016-05-18',
    description: 'TRACE : OPP000138239\r\nCRM: 50111504',
    externalReference: 10281464 },
  { name: 'Tablet MVP',
    portfolio: 'HSBC UK',
    startDate: '2015-12-10',
    endDate: '2016-03-31',
    description: '',
    externalReference: 10322926 },
  { name: 'Wo2 : Transition',
    portfolio: 'Chelsea',
    startDate: '2016-01-05',
    endDate: '2016-04-29',
    description: '',
    externalReference: 10327164 },
  { name: 'Wo4 : CHEF',
    portfolio: 'Chelsea',
    startDate: '2016-02-29',
    endDate: '2016-05-27',
    description: '',
    externalReference: 10345351 }];

    var removeArray = [
      { name: 'CD CI Phase 2'},
      { name: 'Wo2 : Transition'}];

    var aProjectSummaryArray = new ProjectSummaryArray();
    aProjectSummaryArray.addProjects(projectArray);
    aProjectSummaryArray.remove(removeArray);
    should(aProjectSummaryArray.size()).equal(projectArray.length - removeArray.length);
    done();
  });

  it('to String', function(done) {
    var projectArray = [ { name: 'CD CI Phase 2',
    portfolio: 'HSBC UK',
    startDate: '2016-02-17',
    endDate: '2016-05-18',
    description: 'TRACE : OPP000138239\r\nCRM: 50111504',
    externalReference: 10281464 },
  { name: 'Tablet MVP',
    portfolio: 'HSBC UK',
    startDate: '2015-12-10',
    endDate: '2016-03-31',
    description: '',
    externalReference: 10322926 },
  { name: 'Wo2 : Transition',
    portfolio: 'Chelsea',
    startDate: '2016-01-05',
    endDate: '2016-04-29',
    description: '',
    externalReference: 10327164 },
  { name: 'Wo4 : CHEF',
    portfolio: 'Chelsea',
    startDate: '2016-02-29',
    endDate: '2016-05-27',
    description: '',
    externalReference: 10345351 }];

    var aProjectSummaryArray = new ProjectSummaryArray();
    aProjectSummaryArray.addProjects(projectArray);
    should(aProjectSummaryArray.asJSON()).not.have.property('projects');
    done();
  });
});
