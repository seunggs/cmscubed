'use strict';

module.exports = {
	port: process.env.PORT || 8000,
	rethinkdb: {
		host: process.env.RDB_HOST,
		port: process.env.RDB_PORT,
		db: 'cmscubed'
	}
};