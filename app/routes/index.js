'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var sess;

module.exports = function (app) {

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(function (req, res) {
			sess = req.session;
			sess.count = (sess.count || 0) + 1;
			console.log(req.session);
			res.sendFile(path + '/public/index.html');
		});

};
