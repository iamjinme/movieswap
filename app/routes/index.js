'use strict';

var path = process.cwd();
var MovieSwap = require(path + '/app/controllers/movieSwap.server.js');
var sess;

module.exports = function (app) {

	var movieSwap = new MovieSwap();

	app.route('/')
		.get(function (req, res) {
			sess = req.session;
			sess.count = (sess.count || 0) + 1;
			console.log(req.session);
			res.sendFile(path + '/public/index.html');
		});

	app.post('/api/signup', movieSwap.signUp);

	//app.post('/api/login', movieSwap.logIn);

};
