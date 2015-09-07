'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');

// set up cors
var corsOptions = {
	origin: 'http://localhost:8000'
};

router.use(cors(corsOptions));
router.options('*', cors(corsOptions));

// link routes
router.use('/auth', require('./auth'));
router.use('/api', require('./api'));

// rest handled by frontend
router.get('*', function (req, res) {
	res.sendfile('../../build/app/index.html');
});

module.exports = router;