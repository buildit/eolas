'use strict'

const about = require('../services/about');
const Express = require('express');
const Router = Express.Router();

Router.get('/', about.ping);
Router.get('/deep', about.deepPing);

module.exports = Router;
