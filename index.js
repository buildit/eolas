'use strict'

const config = require('config');
const log4js = require('log4js');
const express = require('express');
const processors = require('./routes/processors');
const about = require('./routes/about');

log4js.configure('./config/log4js_config.json', {});
const logger = log4js.getLogger();
logger.setLevel(config.get('log-level'));

const app = express();

app.use('/', processors);
app.use('/ping', about);

const port = config.get('server.port');
app.listen(port, function () {
  logger.info('Synergy REST API Service listening on port ' + port + '!');
});
