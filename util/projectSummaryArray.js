const R = require('ramda');

class ProjectSummaryArray {

  constructor() {
    this.projects = [];
  };

  asJSON() {
    return JSON.parse(JSON.stringify(this.projects));
  };

  size() {
    return this.projects.length
  };

  addProject(name, program, portfolio, description, startDate, endDate, externalReference) {
    var aProject = {};
    aProject.name = name;
    aProject.program = program;
    aProject.portfolio = portfolio;
    aProject.description = description;
    aProject.startDate = startDate;
    aProject.endDate = endDate;
    aProject.externalReference = externalReference;

    this.projects.push(aProject);
  }

  addProjects(arrayOfProjects) {
    this.projects = R.union(this.projects, arrayOfProjects);
  };

  remove(projectNameArray) {
    var compare = (x, y) => x.name == y.name;
    this.projects = R.differenceWith(compare, this.projects, projectNameArray);
  };
}

exports.ProjectSummaryArray = ProjectSummaryArray;
