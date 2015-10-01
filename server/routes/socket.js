'use strict';
/*jshint camelcase: false */

var R = require('ramda');
var r = require('../config/rdbdash');

module.exports = function (io) {

	/* -- PURE ---------------------------------------------------------------------------- */

	var errHandler = function (err) {
		console.log('Something went wrong: ', err);
	};


	/* -- MAIN ---------------------------------------------------------------------------- */

	// update db whenever message is received
	io.on('connection', function (socket) {
		socket.on('field update', function (data) {
			console.log('field update data: ', data);
			// var userName = data.user;
			var pageName = data.page;
			var content = data.content;

			// TODO: switch over to multi-indexes for user, page, and field for faster retrieval
			// Check if the record exists first, if so, insert; otherwise update
			r.table('content')
				.getAll(pageName, { index: 'page' })
				.run()
				.then(function (dbRes) {
					if (R.isEmpty(dbRes)) {
						return r.table('content')
							.insert({
								page: pageName,
								content: content
							}, { returnChanges: true })
							.run();
					} else {
						return r.table('content')
							.getAll(pageName, { index: 'page' })
							.update({ content: content }, { returnChanges: true })
							.run();
					}
				})
				.then(function (dbRes) {
					console.log(dbRes);
					io.emit('db change', dbRes.changes);
				});

		});
	});
	
	// TODO: broadcast broken
	// broadcast with socket whenever db changes
	r.table('content')
		.changes()
		.run({cursor: true})
		.then(function (cursor) {
			console.log('db change broadcasted');
			cursor.each(function (err, data) {
				io.emit('db change', data);
			});
		})
		.catch(errHandler);

};