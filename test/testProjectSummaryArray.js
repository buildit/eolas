'use strict'

const ProjectSummaryArray = require('../util/projectSummaryArray');
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


});
