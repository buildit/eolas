'use strict'

const co = require('co');
const config = require('config');
const log4js = require('log4js');
const MongoClient = require('mongodb');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

exports.ping = function(req, res) {
  logger.debug('ping');
  res.json(config);
};

exports.deepPing = function (req, res) {
  logger.debug('pingDeep');

  var dbUrl = config.get('datastore.dbUrl');
  var connectionInformation = [];
  connectionInformation.push({'data store url' : dbUrl});

  co(function*() {
    var db = yield MongoClient.connect(dbUrl);
    var adminDb = db.admin();
    var info = yield adminDb.buildInfo();
    db.close();
    res.send(generateConnectionInformation(dbUrl, info.version));
  }).catch(function(err) {
    logger.error(err);
    connectionInformation.push({'data store version' : 'Unable to access the data store'});
    res.send(generateConnectionInformation(dbUrl, 'Unable to access the data store'));
  });
};

function generateConnectionInformation(url, version) {
  return {datastoreURL : url, datastoreVersion: version};
}
