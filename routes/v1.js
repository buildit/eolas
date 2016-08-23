'use strict'

const express = require('express');
const router = express.Router();
const about = require('../services/about');
const apiDocs = require('../api_doc/swaggerDoc');

router.get('/ping', about.ping);
router.get('/ping/deep', about.deepPing);
router.get('/doc', apiDocs.serveDoc);

module.exports = router;
