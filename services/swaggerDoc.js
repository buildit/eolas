'use strict';

const Config = require('config');
const FS = require('fs');
const Log4js = require('log4js');
const TryMe = require('try');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

exports.serveDoc = function(req, res) {
  logger.debug('serve swagger api doc');
  var spec = 'Unable to find api doc.';

  var tmp = req.originalUrl.split('/');
  var pathToFile = './api_doc/' + tmp[1] + '/swagger.json'

  new TryMe ( function(){
    spec = FS.readFileSync(pathToFile, 'utf8');
  }).finally(function (err) {
      logger.error(err);
  });

  res.send(spec);
};
