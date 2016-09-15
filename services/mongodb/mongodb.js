'use strict'

const config = require('config');
const log4js = require('log4js');
const MongoClient = require('mongodb');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

/* eslint-disable no-unused-vars */
exports.deepPing = function () {
  logger.debug('pingDeep - mongodb');

  var dbUrl = config.get('datastore.dbUrl');

  return new Promise(function (resolve, reject) {
    MongoClient.connect(dbUrl, function(err, db) {
      if (err) {
        logger.error(`Error connecting to Mongo ${dbUrl}`);
        resolve(generateConnectionInformation(dbUrl, 'Unable to access the data store'));
      } else {
        var adminDb = db.admin();
        adminDb.buildInfo(function(err, info) {
          if (err) {
            logger.error(`Error connecting to Mongo ${dbUrl}`);
            resolve(generateConnectionInformation(dbUrl, 'Unable to access admin data store'));
          } else {
            resolve(generateConnectionInformation(dbUrl, info.version));
          }
        });
      }
    });
  });
};
/* eslint-enable no-unused-vars */

function generateConnectionInformation(url, version) {
  logger.debug(`DataStoreURL : ${url} - DataStoreVersion: ${version}`);
  return {DataStoreURL: url, DataStoreVersion: version};
}
