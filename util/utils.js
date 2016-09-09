'use strict'

const config = require('config');

exports.dbProjectPath = function (projectName) {
  var dbUrl = `${config.get('datastore.dbUrl')}/${config.get('datastore.context')}-${projectName.replace(/\W/g, '')}`;
  return dbUrl;
};

exports.dbCorePath = function () {
  return this.dbProjectPath(config.get('datastore.rootDB'));
};

function generateRootServiceUrl () {
  var url = `http://${config.get('server.url')}:${config.get('server.port')}/v1/project`;
  return url;
};

exports.generateServiceUrl = function (projectName) {
  var url = `${generateRootServiceUrl()}/${encodeURIComponent(projectName)}`;
  return url;
};

exports.generateServiceUrlWithQuery = function (queryString) {
  var url = `${generateRootServiceUrl()}?${queryString}`;
  return url;
};

exports.generatePortlessServiceUrl = function (projectName) {
  var url = `http://${config.get('server.url')}/v1/project/${encodeURIComponent(projectName)}`;
  return url;
};

exports.createBasicAuthHeader = function(encodedUser) {
  var headers = {
  	'Authorization': 'Basic ' +  encodedUser,
  	'Accept':'application/json',
  	'Content-Type':'application/json'};
  return headers;
}
