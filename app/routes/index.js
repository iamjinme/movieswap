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

	app.post('/api/users', movieSwap.saveUser);
	app.post('/api/users/password', movieSwap.changePassword);

	app.get('/api/search/:movie', movieSwap.getSearch);

	app.post('/api/movies', movieSwap.addMovie);
	app.get('/api/movies', movieSwap.getMoviesAll);
	app.delete('/api/movies/:id', movieSwap.delMovie);
	app.get('/api/movies/user', movieSwap.getMoviesUser);

	app.put('/api/likes/:id', movieSwap.toggleLike);
	app.put('/api/trades/add/:id', movieSwap.putTradeIt);
	app.put('/api/trades/del/:id', movieSwap.putUnTrade);
	app.put('/api/trades/accept/:id', movieSwap.putTradeAccept);
	app.get('/api/trades/in', movieSwap.getTradeIn);
	app.get('/api/trades/out', movieSwap.getTradeOut);

};
