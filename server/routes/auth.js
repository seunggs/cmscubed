'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var r = require('../config/rdbdash');

router.get('/loggedin', function (req, res) {
	if (req.user) {
		r.table('users')
			.get(req.user.id)
			.changes()
			.run()
			.then(function (userCursor) {
				userCursor.next(function (err, user) {
					res.send(user);
				});
			})
			.catch(function () {
				res.send(false);
			});
	} else {
		res.send(false);
	}
});

router.get('/logout', function (req, res) {
	req.logout();
	res.send('Logout successful');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// once google has authenticated the user
router.get('/google/callback', 
	passport.authenticate('google', { 
		successRedirect: '/#',
		failureRedirect: '/#/login',
		successFlash: 'Welcome!',
		failureFlash: true
	})
);

module.exports = router;