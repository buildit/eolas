'use strict'

const express = require('express');
const router = express.Router();
const about = require('../services/about');

router.get('/', about.ping);
router.get('/deep', about.deepPing);

module.exports = router;
