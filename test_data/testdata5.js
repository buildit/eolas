'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const utils = require('../util/utils');

// ***************************************
//
//  initialize HERE
//
// ***************************************

var project = {};
var demandSequence = [];
var defectSeverity = [];
var roleNames = [];
var demandInfo = {};
var defectInfo = {};
var effortInfo = {};

// ***************************************
// *********  Project structures
// ***************************************

demandSequence = [];
demandSequence.push({name: "Backlog", groupWith: null});
demandSequence.push({name: "Selected for Development", groupWith: null});
demandSequence.push({name: "In Progress", groupWith: null});
demandSequence.push({name: "Done", groupWith: null});
demandInfo = {
  source: "Excel",
  url: "",
  project: "TestData5",
  authPolicy: "None",
  userData: "",
  flow: demandSequence};

defectSeverity = [];
defectSeverity.push({name: "Trivial", groupWith: null});
defectSeverity.push({name: "Minor", groupWith: null});
defectSeverity.push({name: "Major", groupWith: 1});
defectSeverity.push({name: "Critical", groupWith: 2});
defectInfo = {
  url: "",
  project: "TestData5",
  authPolicy: "None",
  userData: "",
  entryState: "Open",
  exitState: "Resolved",
  severity: defectSeverity};


roleNames = [];
roleNames.push({name: "PM", groupWith: "BA"});
roleNames.push({name: "BA", groupWith: "PM"});
roleNames.push({name: "SD", groupWith: null});
roleNames.push({name: "Build", groupWith: null});
roleNames.push({name: "Test", groupWith: null});
roleNames.push({name: "Release Mgmt", groupWith: null});
effortInfo = {
  url: "",
  project: "TestData5",
  authPolicy: "None",
  userData: "",
  role: roleNames};

  project = {
    name: "Test Project 5",
    program: "Basic Test Data",
    portfolio: "Acceptance Test Data",
    description: "For testing Backlog regression. Backlog data trends upward.",
    startDate: "2016-07-01",
    endDate: "2016-12-01",
    demand: demandInfo,
    defect: defectInfo,
    effort: effortInfo,
  };

MongoClient.connect(utils.dbCorePath(), function (err, db) {
  assert.equal(null, err);
  var col = db.collection('project');
  col.findOneAndReplace(
    {name: project.name},
    project,
    {upsert: true},
    function (error, doc) {
      assert.equal(null, error);
      assert.equal(1, doc.lastErrorObject.n);
      db.close();
    }
  );
});

// ***************************************
// *********  Demand Data
// ***************************************

var demand = [
  {"projectDate":"2016/07/11","status":{"Backlog":5}},
  {"projectDate":"2016/07/12","status":{"Backlog":10}},
  {"projectDate":"2016/07/13","status":{"Backlog":15}},
  {"projectDate":"2016/07/14","status":{"Backlog":20}},
  {"projectDate":"2016/07/15","status":{"Backlog":25}},
  {"projectDate":"2016/07/16","status":{"Backlog":25}},
  {"projectDate":"2016/07/17","status":{"Backlog":25}},
  {"projectDate":"2016/07/18","status":{"Backlog":30}},
  {"projectDate":"2016/07/19","status":{"Backlog":40}},
  {"projectDate":"2016/07/20","status":{"Backlog":50}},
  {"projectDate":"2016/07/21","status":{"Backlog":60}},
  {"projectDate":"2016/07/22","status":{"Backlog":65}},
  {"projectDate":"2016/07/23","status":{"Backlog":65}},
  {"projectDate":"2016/07/24","status":{"Backlog":65}},
  {"projectDate":"2016/07/25","status":{"Backlog":80}},
  {"projectDate":"2016/07/26","status":{"Backlog":90}},
  {"projectDate":"2016/07/27","status":{"Backlog":100}},
  {"projectDate":"2016/07/28","status":{"Backlog":125}},
  {"projectDate":"2016/07/29","status":{"Backlog":150}},
  {"projectDate":"2016/07/30","status":{"Backlog":150}},
  {"projectDate":"2016/07/31","status":{"Backlog":150}},
  {"projectDate":"2016/08/01","status":{"Backlog":150}},
  {"projectDate":"2016/08/02","status":{"Backlog":150}},
  {"projectDate":"2016/08/03","status":{"Backlog":150}},
  {"projectDate":"2016/08/04","status":{"Backlog":150}},
  {"projectDate":"2016/08/05","status":{"Backlog":150}},
  {"projectDate":"2016/08/06","status":{"Backlog":150}},
  {"projectDate":"2016/08/07","status":{"Backlog":150}},
  {"projectDate":"2016/08/08","status":{"Backlog":150,"Selected for Development":7,"In Progress":3}},
  {"projectDate":"2016/08/09","status":{"Backlog":150,"Selected for Development":7,"In Progress":3}},
  {"projectDate":"2016/08/10","status":{"Backlog":150,"Selected for Development":7,"In Progress":3}},
  {"projectDate":"2016/08/11","status":{"Backlog":150,"Selected for Development":7,"In Progress":3}},
  {"projectDate":"2016/08/12","status":{"Backlog":150,"Selected for Development":7,"In Progress":2,"Done":1}},
  {"projectDate":"2016/08/13","status":{"Backlog":150,"Selected for Development":7,"In Progress":2,"Done":1}},
  {"projectDate":"2016/08/14","status":{"Backlog":150,"Selected for Development":7,"In Progress":2,"Done":1}},
  {"projectDate":"2016/08/15","status":{"Backlog":150,"Selected for Development":5,"In Progress":3,"Done":2}},
  {"projectDate":"2016/08/16","status":{"Backlog":150,"Selected for Development":4,"In Progress":3,"Done":3}},
  {"projectDate":"2016/08/17","status":{"Backlog":150,"Selected for Development":3,"In Progress":3,"Done":4}},
  {"projectDate":"2016/08/18","status":{"Backlog":150,"Selected for Development":2,"In Progress":3,"Done":5}},
  {"projectDate":"2016/08/19","status":{"Backlog":150,"Selected for Development":1,"In Progress":3,"Done":6}},
  {"projectDate":"2016/08/20","status":{"Backlog":150,"Selected for Development":2,"In Progress":3,"Done":5}},
  {"projectDate":"2016/08/21","status":{"Backlog":150,"Selected for Development":2,"In Progress":3,"Done":5}},
  {"projectDate":"2016/08/22","status":{"Backlog":150,"Selected for Development":16,"In Progress":4,"Done":5}},
  {"projectDate":"2016/08/23","status":{"Backlog":150,"Selected for Development":14,"In Progress":4,"Done":7}},
  {"projectDate":"2016/08/24","status":{"Backlog":150,"Selected for Development":9,"In Progress":6,"Done":10}},
  {"projectDate":"2016/08/25","status":{"Backlog":150,"Selected for Development":9,"In Progress":6,"Done":10}},
  {"projectDate":"2016/08/26","status":{"Backlog":150,"Selected for Development":8,"In Progress":6,"Done":11}},
  // {"projectDate":"2016/08/27","status":{"Backlog":1,"Selected for Development":8,"In Progress":6,"Done":11}},
  // {"projectDate":"2016/08/28","status":{"Backlog":1,"Selected for Development":8,"In Progress":6,"Done":11}},
  // {"projectDate":"2016/08/29","status":{"Backlog":1,"Selected for Development":10,"In Progress":6,"Done":9}},
  // {"projectDate":"2016/08/30","status":{"Backlog":1,"Selected for Development":9,"In Progress":4,"Done":12}},
  // {"projectDate":"2016/08/31","status":{"Backlog":1,"Selected for Development":7,"In Progress":6,"Done":12}},
  // {"projectDate":"2016/09/01","status":{"Backlog":1,"Selected for Development":7,"In Progress":6,"Done":12}},
  // {"projectDate":"2016/09/02","status":{"Backlog":1,"Selected for Development":7,"In Progress":0,"Done":18}},
  // {"projectDate":"2016/09/03","status":{"Backlog":1,"Selected for Development":7,"In Progress":0,"Done":18}},
  // {"projectDate":"2016/09/04","status":{"Backlog":1,"Selected for Development":7,"In Progress":0,"Done":18}},
  // {"projectDate":"2016/09/05","status":{"Backlog":1,"Selected for Development":20,"In Progress":0,"Done":18}},
  // {"projectDate":"2016/09/06","status":{"Backlog":1,"Selected for Development":14,"In Progress":6,"Done":18}},
  // {"projectDate":"2016/09/07","status":{"Backlog":1,"Selected for Development":14,"In Progress":6,"Done":18}},
  // {"projectDate":"2016/09/08","status":{"Backlog":1,"Selected for Development":12,"In Progress":6,"Done":20}},
  // {"projectDate":"2016/09/09","status":{"Backlog":1,"Selected for Development":12,"In Progress":2,"Done":24}},
  // {"projectDate":"2016/09/10","status":{"Backlog":1,"Selected for Development":12,"In Progress":2,"Done":24}},
  // {"projectDate":"2016/09/11","status":{"Backlog":1,"Selected for Development":12,"In Progress":2,"Done":24}},
  // {"projectDate":"2016/09/12","status":{"Backlog":1,"Selected for Development":4,"In Progress":8,"Done":26}},
  // {"projectDate":"2016/09/13","status":{"Backlog":1,"Selected for Development":3,"In Progress":8,"Done":27}},
  // {"projectDate":"2016/09/14","status":{"Backlog":1,"Selected for Development":2,"In Progress":8,"Done":28}},
  // {"projectDate":"2016/09/15","status":{"Backlog":1,"Selected for Development":5,"In Progress":4,"Done":29}},
  // {"projectDate":"2016/09/16","status":{"Backlog":1,"Selected for Development":8,"In Progress":0,"Done":30}},
  // {"projectDate":"2016/09/17","status":{"Backlog":1,"Selected for Development":8,"In Progress":0,"Done":30}},
  // {"projectDate":"2016/09/18","status":{"Backlog":1,"Selected for Development":8,"In Progress":0,"Done":30}},
  // {"projectDate":"2016/09/19","status":{"Backlog":1,"Selected for Development":15,"In Progress":0,"Done":30}},
  // {"projectDate":"2016/09/20","status":{"Backlog":1,"Selected for Development":5,"In Progress":8,"Done":32}},
  // {"projectDate":"2016/09/21","status":{"Backlog":1,"Selected for Development":3,"In Progress":8,"Done":34}},
  // {"projectDate":"2016/09/22","status":{"Backlog":1,"Selected for Development":7,"In Progress":8,"Done":30}},
  // {"projectDate":"2016/09/23","status":{"Backlog":1,"Selected for Development":7,"In Progress":8,"Done":30}},
  // {"projectDate":"2016/09/24","status":{"Backlog":1,"Selected for Development":1,"In Progress":8,"Done":36}},
  // {"projectDate":"2016/09/25","status":{"Backlog":1,"Selected for Development":1,"In Progress":8,"Done":36}},
  // {"projectDate":"2016/09/26","status":{"Backlog":1,"Selected for Development":6,"In Progress":6,"Done":38}},
  // {"projectDate":"2016/09/27","status":{"Backlog":1,"Selected for Development":4,"In Progress":6,"Done":40}},
  // {"projectDate":"2016/09/28","status":{"Backlog":1,"Selected for Development":6,"In Progress":4,"Done":40}},
  // {"projectDate":"2016/09/29","status":{"Backlog":1,"Selected for Development":3,"In Progress":2,"Done":45}},
  // {"projectDate":"2016/09/30","status":{"Backlog":1,"Selected for Development":0,"In Progress":0,"Done":50}},
  // {"projectDate":"2016/10/01","status":{"Backlog":1,"Selected for Development":0,"In Progress":5,"Done":50}},
  // {"projectDate":"2016/10/02","status":{"Backlog":1,"Selected for Development":0,"In Progress":0,"Done":55}},
  // {"projectDate":"2016/10/03","status":{"Backlog":1,"Selected for Development":20,"In Progress":5,"Done":55}},
  // {"projectDate":"2016/10/04","status":{"Backlog":1,"Selected for Development":17,"In Progress":8,"Done":55}},
  // {"projectDate":"2016/10/05","status":{"Backlog":1,"Selected for Development":16,"In Progress":6,"Done":58}},
  // {"projectDate":"2016/10/06","status":{"Backlog":1,"Selected for Development":13,"In Progress":5,"Done":62}},
  // {"projectDate":"2016/10/07","status":{"Backlog":1,"Selected for Development":10,"In Progress":5,"Done":65}},
  // {"projectDate":"2016/10/08","status":{"Backlog":1,"Selected for Development":10,"In Progress":5,"Done":65}},
  // {"projectDate":"2016/10/09","status":{"Backlog":1,"Selected for Development":10,"In Progress":5,"Done":65}},
  // {"projectDate":"2016/10/10","status":{"Backlog":1,"Selected for Development":25,"In Progress":0,"Done":55}},
  // {"projectDate":"2016/10/11","status":{"Backlog":1,"Selected for Development":25,"In Progress":0,"Done":55}},
  // {"projectDate":"2016/10/12","status":{"Backlog":1,"Selected for Development":25,"In Progress":0,"Done":55}},
  // {"projectDate":"2016/10/13","status":{"Backlog":1,"Selected for Development":25,"In Progress":0,"Done":55}},
  // {"projectDate":"2016/10/14","status":{"Backlog":1,"Selected for Development":4,"In Progress":3,"Done":73}},
  // {"projectDate":"2016/10/15","status":{"Backlog":1,"Selected for Development":4,"In Progress":3,"Done":73}},
  // {"projectDate":"2016/10/16","status":{"Backlog":1,"Selected for Development":4,"In Progress":1,"Done":75}},
  // {"projectDate":"2016/10/17","status":{"Backlog":1,"Selected for Development":20,"In Progress":10,"Done":75}},
  // {"projectDate":"2016/10/18","status":{"Backlog":1,"Selected for Development":20,"In Progress":10,"Done":75}},
  // {"projectDate":"2016/10/19","status":{"Backlog":1,"Selected for Development":18,"In Progress":10,"Done":77}},
  // {"projectDate":"2016/10/20","status":{"Backlog":1,"Selected for Development":15,"In Progress":10,"Done":80}},
  // {"projectDate":"2016/10/21","status":{"Backlog":1,"Selected for Development":12,"In Progress":10,"Done":83}},
  // {"projectDate":"2016/10/22","status":{"Backlog":1,"Selected for Development":12,"In Progress":10,"Done":83}},
  // {"projectDate":"2016/10/23","status":{"Backlog":1,"Selected for Development":7,"In Progress":10,"Done":88}},
  // {"projectDate":"2016/10/24","status":{"Backlog":1,"Selected for Development":6,"In Progress":10,"Done":89}},
  // {"projectDate":"2016/10/25","status":{"Backlog":1,"Selected for Development":3,"In Progress":8,"Done":94}},
  // {"projectDate":"2016/10/26","status":{"Backlog":1,"Selected for Development":2,"In Progress":6,"Done":97}},
  // {"projectDate":"2016/10/27","status":{"Backlog":1,"Selected for Development":2,"In Progress":4,"Done":99}},
  // {"projectDate":"2016/10/28","status":{"Backlog":1,"Selected for Development":2,"In Progress":3,"Done":100}},
  // {"projectDate":"2016/10/29","status":{"Backlog":1,"Selected for Development":1,"In Progress":4,"Done":100}},
  // {"projectDate":"2016/10/30","status":{"Backlog":1,"Selected for Development":0,"In Progress":0,"Done":105}},
  // {"projectDate":"2016/10/31","status":{"Backlog":1,"Selected for Development":4,"In Progress":1,"Done":105}},
  // {"projectDate":"2016/11/01","status":{"Backlog":1,"Selected for Development":3,"In Progress":1,"Done":106}},
  // {"projectDate":"2016/11/02","status":{"Backlog":1,"Selected for Development":2,"In Progress":1,"Done":107}},
  // {"projectDate":"2016/11/03","status":{"Backlog":1,"Selected for Development":1,"In Progress":1,"Done":108}}
];

  var url = utils.dbProjectPath(project.name);

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    var col = db.collection('dailyDemandSummary');
    col.deleteMany({}).then(function () {
      col.insertMany(demand).then(function (r) {
        assert.equal(demand.length, r.insertedCount);
      });
      db.close();
    });
  });


var defect = [
  {"projectDate":"2016/08/22", "severity":{"Critical":1,"Major":2}},
  {"projectDate":"2016/08/23", "severity":{"Critical":2,"Major":4,"Minor":3,"Trivial":2}},
  {"projectDate":"2016/08/24", "severity":{"Critical":1,"Major":6,"Minor":4,"Trivial":4}},
  {"projectDate":"2016/08/25", "severity":{"Critical":1,"Major":8,"Minor":5,"Trivial":5}},
  {"projectDate":"2016/08/26", "severity":{"Critical":2,"Major":8,"Minor":6,"Trivial":6}},
  {"projectDate":"2016/08/27", "severity":{"Critical":2,"Major":8,"Minor":6,"Trivial":5}},
  {"projectDate":"2016/08/28", "severity":{"Critical":2,"Major":7,"Minor":6,"Trivial":4}},
  {"projectDate":"2016/08/29", "severity":{"Critical":4,"Major":5,"Minor":10,"Trivial":5}},
  {"projectDate":"2016/08/30", "severity":{"Critical":4,"Major":3,"Minor":11,"Trivial":6}},
  {"projectDate":"2016/08/31", "severity":{"Critical":4,"Major":5,"Minor":12,"Trivial":7}},
  {"projectDate":"2016/09/01", "severity":{"Critical":4,"Major":7,"Minor":8,"Trivial":8}},
  {"projectDate":"2016/09/02", "severity":{"Critical":3,"Major":9,"Minor":8,"Trivial":6}},
  {"projectDate":"2016/09/03", "severity":{"Critical":3,"Major":9,"Minor":8,"Trivial":7}},
  {"projectDate":"2016/09/04", "severity":{"Critical":3,"Major":4,"Minor":8,"Trivial":6}},
  {"projectDate":"2016/09/05", "severity":{"Critical":5,"Major":5,"Minor":7,"Trivial":5}},
  {"projectDate":"2016/09/06", "severity":{"Critical":5,"Major":5,"Minor":6,"Trivial":4}},
  {"projectDate":"2016/09/07", "severity":{"Critical":5,"Major":5,"Minor":6,"Trivial":5}},
  {"projectDate":"2016/09/08", "severity":{"Critical":4,"Major":3,"Minor":7,"Trivial":6}},
  {"projectDate":"2016/09/09", "severity":{"Critical":1,"Major":3,"Minor":8,"Trivial":7}},
  {"projectDate":"2016/09/10", "severity":{"Critical":1,"Major":3,"Minor":9,"Trivial":6}},
  {"projectDate":"2016/09/11", "severity":{"Critical":1,"Major":3,"Minor":9,"Trivial":5}},
  {"projectDate":"2016/09/12", "severity":{"Critical":7,"Major":9,"Minor":9,"Trivial":4}},
  {"projectDate":"2016/09/13", "severity":{"Critical":7,"Major":9,"Minor":9,"Trivial":2}},
  {"projectDate":"2016/09/14", "severity":{"Critical":8,"Major":9,"Minor":10,"Trivial":2}},
  {"projectDate":"2016/09/15", "severity":{"Critical":9,"Major":13,"Minor":11,"Trivial":4}},
  {"projectDate":"2016/09/16", "severity":{"Critical":10,"Major":13,"Minor":20,"Trivial":5}},
  {"projectDate":"2016/09/17", "severity":{"Critical":10,"Major":13,"Minor":20,"Trivial":6}},
  {"projectDate":"2016/09/18", "severity":{"Critical":10,"Major":13,"Minor":20,"Trivial":2}},
  {"projectDate":"2016/09/19", "severity":{"Critical":5,"Major":7,"Minor":20,"Trivial":7}},
  {"projectDate":"2016/09/20", "severity":{"Critical":5,"Major":7,"Minor":15,"Trivial":7}},
  {"projectDate":"2016/09/21", "severity":{"Critical":4,"Major":5,"Minor":14,"Trivial":7}},
  {"projectDate":"2016/09/22", "severity":{"Critical":3,"Major":5,"Minor":13,"Trivial":7}},
  {"projectDate":"2016/09/23", "severity":{"Critical":1,"Major":5,"Minor":15,"Trivial":5}},
  {"projectDate":"2016/09/24", "severity":{"Critical":1,"Major":4,"Minor":15,"Trivial":5}},
  {"projectDate":"2016/09/25", "severity":{"Critical":1,"Major":4,"Minor":15,"Trivial":5}},
  {"projectDate":"2016/09/26", "severity":{"Critical":15,"Major":4,"Minor":10,"Trivial":5}},
  {"projectDate":"2016/09/27", "severity":{"Critical":15,"Major":2,"Minor":3,"Trivial":2}},
  {"projectDate":"2016/09/28", "severity":{"Critical":15,"Major":2,"Minor":3,"Trivial":2}},
  {"projectDate":"2016/09/29", "severity":{"Critical":2,"Major":1,"Minor":23,"Trivial":2}},
  {"projectDate":"2016/09/30", "severity":{"Critical":0,"Major":1,"Minor":23,"Trivial":2}},
  {"projectDate":"2016/10/01", "severity":{"Critical":0,"Minor":23,"Trivial":2}},
  {"projectDate":"2016/10/02", "severity":{"Critical":0,"Minor":23,"Trivial":2}},
  {"projectDate":"2016/10/03", "severity":{"Critical":6,"Major":8,"Minor":23,"Trivial":8}},
  {"projectDate":"2016/10/04", "severity":{"Critical":6,"Major":8,"Minor":20,"Trivial":8}},
  {"projectDate":"2016/10/05", "severity":{"Critical":5,"Major":15,"Minor":15,"Trivial":8}},
  {"projectDate":"2016/10/06", "severity":{"Critical":4,"Major":15,"Minor":15,"Trivial":8}},
  {"projectDate":"2016/10/07", "severity":{"Critical":3,"Major":15,"Minor":15,"Trivial":8}},
  {"projectDate":"2016/10/08", "severity":{"Critical":5,"Major":15,"Minor":15,"Trivial":8}},
  {"projectDate":"2016/10/09", "severity":{"Critical":6,"Major":9,"Minor":30,"Trivial":8}},
  {"projectDate":"2016/10/10", "severity":{"Critical":4,"Major":9,"Minor":30,"Trivial":11}},
  {"projectDate":"2016/10/11", "severity":{"Critical":4,"Major":5,"Minor":30,"Trivial":11}},
  {"projectDate":"2016/10/12", "severity":{"Critical":5,"Major":5,"Minor":30,"Trivial":11}},
  {"projectDate":"2016/10/13", "severity":{"Critical":2,"Major":5,"Minor":30,"Trivial":11}},
  {"projectDate":"2016/10/14", "severity":{"Critical":3,"Major":5,"Minor":30,"Trivial":11}},
  {"projectDate":"2016/10/15", "severity":{"Critical":1,"Major":3,"Minor":30,"Trivial":11}},
  {"projectDate":"2016/10/16", "severity":{"Critical":3,"Major":3,"Minor":30,"Trivial":11}},
  {"projectDate":"2016/10/17", "severity":{"Critical":2,"Major":3,"Minor":20,"Trivial":7}},
  {"projectDate":"2016/10/18", "severity":{"Major":2,"Minor":20,"Trivial":7}},
  {"projectDate":"2016/10/19", "severity":{"Critical":2,"Major":2,"Minor":20,"Trivial":7}},
  {"projectDate":"2016/10/20", "severity":{"Critical":6,"Major":4,"Minor":20,"Trivial":7}},
  {"projectDate":"2016/10/21", "severity":{"Critical":6,"Major":4,"Minor":20,"Trivial":7}},
  {"projectDate":"2016/10/22", "severity":{"Critical":6,"Major":4,"Minor":10,"Trivial":2}},
  {"projectDate":"2016/10/23", "severity":{"Critical":6,"Major":11,"Minor":10,"Trivial":2}},
  {"projectDate":"2016/10/24", "severity":{"Critical":6,"Major":11,"Minor":10,"Trivial":2}},
  {"projectDate":"2016/10/25", "severity":{"Critical":5,"Major":6,"Minor":10,"Trivial":2}},
  {"projectDate":"2016/10/26", "severity":{"Critical":4,"Major":6,"Minor":10,"Trivial":2}},
  {"projectDate":"2016/10/27", "severity":{"Critical":2,"Major":5,"Minor":10,"Trivial":2}},
  {"projectDate":"2016/10/28", "severity":{"Critical":1,"Major":2,"Minor":10,"Trivial":2}},
  {"projectDate":"2016/10/29", "severity":{"Minor":20,"Trivial":15}},
  {"projectDate":"2016/10/30", "severity":{"Minor":20,"Trivial":15}},
  {"projectDate":"2016/10/31", "severity":{"Minor":20,"Trivial":15}},
  {"projectDate":"2016/11/01", "severity":{"Minor":18,"Trivial":15}},
  {"projectDate":"2016/11/02", "severity":{"Minor":18,"Trivial":15}},
  {"projectDate":"2016/11/03", "severity":{"Minor":18,"Trivial":15}},
  {"projectDate":"2016/11/04", "severity":{"Minor":18,"Trivial":15}},
  {"projectDate":"2016/11/05", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/06", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/07", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/08", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/09", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/10", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/11", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/12", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/13", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/14", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/15", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/16", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/17", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/18", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/19", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/20", "severity":{"Minor":12,"Trivial":10}},
  {"projectDate":"2016/11/21", "severity":{"Minor":10,"Trivial":10}},
  {"projectDate":"2016/11/22", "severity":{"Minor":10,"Trivial":10}},
  {"projectDate":"2016/11/23", "severity":{"Minor":10,"Trivial":10}},
  {"projectDate":"2016/11/24", "severity":{"Minor":10,"Trivial":10}},
  {"projectDate":"2016/11/25", "severity":{"Minor":10,"Trivial":10}}
];

MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  var col = db.collection('dailyDefectSummary');
  col.deleteMany({}).then(function () {
    col.insertMany(defect).then(function (r) {
      assert.equal(defect.length, r.insertedCount);
    });
    db.close();
  });
});

var effort = [
  {"projectDate":"2016/07/01", "activity":{"PM":3}},
  {"projectDate":"2016/07/04", "activity":{"PM":2,"BA":1}},
  {"projectDate":"2016/07/05", "activity":{"PM":2,"BA":1}},
  {"projectDate":"2016/07/06", "activity":{"PM":2,"BA":1}},
  {"projectDate":"2016/07/07", "activity":{"PM":2,"BA":1}},
  {"projectDate":"2016/07/08", "activity":{"PM":2,"BA":1}},
  {"projectDate":"2016/07/11", "activity":{"PM":1,"BA":2,"SD":2}},
  {"projectDate":"2016/07/12", "activity":{"PM":1,"BA":2,"SD":2}},
  {"projectDate":"2016/07/13", "activity":{"PM":1,"BA":2,"SD":2}},
  {"projectDate":"2016/07/14", "activity":{"PM":1,"BA":2,"SD":2}},
  {"projectDate":"2016/07/15", "activity":{"PM":1,"BA":2,"SD":2}},
  {"projectDate":"2016/07/18", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/19", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/20", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/21", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/22", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/25", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/26", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/27", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/28", "activity":{"PM":2,"BA":3,"SD":4}},
  {"projectDate":"2016/07/29", "activity":{"PM":4,"BA":3,"SD":4}},
  {"projectDate":"2016/08/01", "activity":{"PM":1,"BA":1,"SD":1,"Build":2,"Test":2}},
  {"projectDate":"2016/08/02", "activity":{"PM":1,"BA":1,"SD":1,"Build":2,"Test":2}},
  {"projectDate":"2016/08/03", "activity":{"PM":1,"BA":1,"SD":1,"Build":2,"Test":2}},
  {"projectDate":"2016/08/04", "activity":{"PM":1,"BA":1,"SD":1,"Build":2,"Test":2}},
  {"projectDate":"2016/08/05", "activity":{"PM":1,"BA":1,"SD":1,"Build":2,"Test":2}},
  {"projectDate":"2016/08/08", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/09", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/10", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/11", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/12", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/15", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/16", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/17", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/18", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/19", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/22", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/23", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/24", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/25", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/26", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/29", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/30", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/08/31", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/09/01", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/09/02", "activity":{"PM":1,"BA":1,"SD":1,"Build":6,"Test":6}},
  {"projectDate":"2016/09/05", "activity":{"PM":1,"BA":2,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/06", "activity":{"PM":1,"BA":2,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/07", "activity":{"PM":1,"BA":2,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/08", "activity":{"PM":1,"BA":2,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/09", "activity":{"PM":1,"BA":2,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/12", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/13", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/14", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/15", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/16", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/19", "activity":{"PM":1,"BA":1,"SD":2,"Build":8,"Test":6}},
  {"projectDate":"2016/09/20", "activity":{"PM":1,"BA":1,"SD":2,"Build":8,"Test":6}},
  {"projectDate":"2016/09/21", "activity":{"PM":1,"BA":1,"SD":2,"Build":8,"Test":6}},
  {"projectDate":"2016/09/22", "activity":{"PM":1,"BA":1,"SD":2,"Build":8,"Test":6}},
  {"projectDate":"2016/09/23", "activity":{"PM":1,"BA":1,"SD":2,"Build":8,"Test":6}},
  {"projectDate":"2016/09/24", "activity":{"PM":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/25", "activity":{"PM":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/26", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/27", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/28", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/29", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/09/30", "activity":{"PM":1,"BA":1,"SD":1,"Build":8,"Test":6}},
  {"projectDate":"2016/10/01", "activity":{"PM":1,"Build":8,"Test":6}},
  {"projectDate":"2016/10/02", "activity":{"PM":1,"Build":8,"Test":6}},
  {"projectDate":"2016/10/03", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/04", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/05", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/06", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/07", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/10", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/11", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/12", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/13", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/14", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/15", "activity":{"PM":2,"Build":10,"Test":10}},
  {"projectDate":"2016/10/16", "activity":{"PM":2,"Build":10,"Test":10}},
  {"projectDate":"2016/10/17", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/18", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/19", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/20", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/21", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/22", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/23", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/24", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/25", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/26", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/27", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/28", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10,"Release Mgmt":2}},
  {"projectDate":"2016/10/29", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/30", "activity":{"PM":2,"BA":1,"SD":1,"Build":10,"Test":10}},
  {"projectDate":"2016/10/31", "activity":{"PM":1,"BA":1,"SD":1,"Build":1,"Test":1,"Release Mgmt":2}},
  {"projectDate":"2016/11/01", "activity":{"Build":1,"Test":1,"Release Mgmt":2}},
  {"projectDate":"2016/11/02", "activity":{"Build":1,"Test":1,"Release Mgmt":2}},
  {"projectDate":"2016/11/03", "activity":{"Build":1,"Test":1,"Release Mgmt":2}},
  {"projectDate":"2016/11/04", "activity":{"Build":1,"Test":1,"Release Mgmt":2}},
  {"projectDate":"2016/11/07", "activity":{"PM":1,"BA":1,"SD":1,"Build":1,"Test":1}},
  {"projectDate":"2016/11/08", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/09", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/10", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/11", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/14", "activity":{"PM":1,"BA":1,"SD":1,"Build":1,"Test":1}},
  {"projectDate":"2016/11/15", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/16", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/17", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/18", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/21", "activity":{"PM":1,"BA":1,"SD":1,"Build":1,"Test":1}},
  {"projectDate":"2016/11/22", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/23", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/24", "activity":{"Build":1,"Test":1}},
  {"projectDate":"2016/11/25", "activity":{"Build":1,"Test":1}}
];

MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  var col = db.collection('dailyEffortSummary');
  col.deleteMany({}).then(function () {
    col.insertMany(effort).then(function (r) {
      assert.equal(effort.length, r.insertedCount);
    });
    db.close();
  });
});
