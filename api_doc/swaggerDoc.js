'use strict';

//var swaggerTools = require('swagger-tools');
const config = require('config');
const fs = require('fs');
const log4js = require('log4js');
const tryMe = require('try');

log4js.configure('config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

exports.serveDoc = function(req, res) {
  logger.debug('serve swagger api doc');
  var spec = 'Unable to find api doc.';

  var tmp = req.originalUrl.split('/');
  var pathToFile = './api_doc/' + tmp[1] + '/swagger.json'

  new tryMe ( function(){
    spec = fs.readFileSync(pathToFile, 'utf8');
  }).finally(function (err) {
      logger.error(err);
  });

  res.send(spec);
};
