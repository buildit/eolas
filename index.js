'use strict'

const config = require('config');
const log4js = require('log4js');
const express = require('express');
const middleware = require('./routes/processors');
const about = require('./routes/about');
const v1Route = require('./routes/v1');

log4js.configure('./config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const app = express();

app.use('/', middleware);
app.use('/ping', about);
app.use('/v1', v1Route);

const port = config.get('server.port');
app.listen(port, function () {
  logger.info('Eolas REST API Service listening on port ' + port + '!');
});
