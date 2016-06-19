'use strict';

var path = process.cwd();
var MovieSwap = require(path + '/app/controllers/movieSwap.server.js');
var sess;

module.exports = function (app) {

	var movieSwap = new MovieSwap();

	app.get('/', movieSwap.initApp);

	app.post('/api/signup', movieSwap.signUp);

	app.post('/api/login', movieSwap.logIn);
	app.get('/api/login', movieSwap.checkLogin);

	app.get('/api/logout', movieSwap.logOut);

	app.get('/api/search/:movie', movieSwap.getSearch);

	app.post('/api/movies', movieSwap.addMovie);
	app.get('/api/movies', movieSwap.getMoviesAll);
	app.delete('/api/movies', movieSwap.delMovie);
	app.get('/api/movies/user', movieSwap.getMoviesUser);

};
