'use strict'

const Config = require('config');
const Log4js = require('log4js');
const Express = require('express');
const middleware = require('./routes/processors');
const about = require('./routes/about');
const v1Route = require('./routes/v1');

if (!Config.has('log-level')) {
  console.log(`Invalid configuration for ${process.env.NODE_ENV} env`);  // eslint-disable-line no-console
  return;
}

Log4js.configure('./config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const app = Express();

app.use('/', middleware);
app.use('/ping', about);
app.use('/v1', v1Route);

const port = Config.get('server.port');
app.listen(port, function () {
  logger.info(`Eolas REST API Service listening on port ${port}!`);
});
