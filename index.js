'use strict'

const Config = require('config');
const Log4js = require('log4js');
const Express = require('express');
const middleware = require('./routes/processors');
const about = require('./routes/about');
const v1Route = require('./routes/v1');

Log4js.configure('./config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.setLevel(Config.get('log-level'));

const app = Express();
const publicMethods = ['GET', 'OPTIONS'];

// access control middleware (allows RO access to not authenticated clients)
if(Config.auth) {
  app.use((req, res, next) => {
    if(publicMethods.includes(req.method) || req.get('X-User')) {
      next();
    } else {
      logger.info("No authentication header -> return 401");
      res.sendStatus(401);
    }
  });
}

app.use('/', middleware);
app.use('/ping', about);
app.use('/v1', v1Route);


const port = Config.get('server.port');
app.listen(port, function () {
  logger.info(`Eolas REST API Service listening on port ${port}!`);
});
