'use strict';
/*jshint camelcase: false */

var express = require('express');
var router = express.Router();
var r = require('../config/rdbdash');


/* -- HELPER FUNCTIONS - PURE -------------------------------------------- */



/* -- Users routes ------------------------------------------------------- */

router.route('/users')

	// GET :: () -> [users]
	.get(function (req, res) {
		r.table('users')
			.run()
			.then(function (users) {
				res.json(users);
			})
			.catch(function (err) {	
				res.send(err);
			});
	});

router.route('/users/:userId')

	// GET :: Params -> {a}
	.get(function (req, res) {
		var userId = req.params.userId;

		r.table('users')
			.get(userId)
			.run()
			.then(function (user) {
				res.json(user);
			})
			.catch(function (err) {
				res.send(err);
			});
	})

	// PUT :: Params -> {a} -> {dbRes}
	.put(function (req, res) {
		var userId = req.params.userId;
		var userUpdate = req.body;

		r.table('users')
			.get(userId)
			.update(userUpdate)
			.run()
			.then(function (dbRes) {
				res.json(dbRes);
			})
			.catch(function (err) {
				res.send(err);
			});
	});


/* -- Content routes ----------------------------------------------------- */

router.route('/content/:page/:field')

	// GET :: Params -> {a}
	.get(function (req, res) {
		var pageName = req.params.page;
		var fieldName = req.params.field;
		console.log('pageName: ', pageName);
		console.log('fieldName: ', fieldName);

		r.table('content')
			.getAll(pageName, { index: 'page' })
			.filter({ field: fieldName })
			.run()
			.then(function (dbRes) {
				res.send(dbRes);
			})
			.catch(function (err) {
				res.send(err);
			});
	});


/* -- EXPORT ------------------------------------------------------------- */

module.exports = router;
