'use strict'

const R = require('ramda');

function ProjectSummaryArray () {
  this.projects = [];
}

ProjectSummaryArray.prototype.addProject = function(name, program, portfolio, description, startDate, endDate, externalReference)
{
  var aProject = {};
  aProject.name = name;
  aProject.program = program;
  aProject.portfolio = portfolio;
  aProject.description = description;
  aProject.startDate = startDate;
  aProject.endDate = endDate;
  aProject.externalReference = externalReference;

  this.projects.push(aProject);
};

ProjectSummaryArray.prototype.size = function() {
  return this.projects.length
};

ProjectSummaryArray.prototype.remove = function(projectNameArray) {
  var compare = (x, y) => x.name == y.name;
  this.projects = R.differenceWith(compare, this.projects, projectNameArray);
};

module.exports = ProjectSummaryArray;
