'use strict'

const config = require('config');

exports.dbProjectPath = function (projectName) {
  var dbUrl = config.get('datastore.dbUrl') + '/' + config.get('datastore.context') + '-' + projectName;
  return dbUrl;
};

exports.dbCorePath = function () {
  return this.dbProjectPath(config.get('datastore.rootDB'));
};
