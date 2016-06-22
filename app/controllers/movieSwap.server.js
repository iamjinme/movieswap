'use strict';

var request = require('request');

var path = process.cwd();
var User = require('../models/users.js');
var Movie = require('../models/movies.js');
var sess;

function MovieSwap () {

	var max_results = 4;

	function isEmpty(obj) {
    return true && JSON.stringify(obj) === JSON.stringify({});
	}

	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

	this.signUp = function(req, res) {
		sess = req.session;
		if (!req.body.name) {
			res.json({error: true, message: 'What is your name?'});
		} else if (!req.body.email) {
			res.json({error: true, message: 'Email is necessary'});
		} else if (!validateEmail(req.body.email)) {
			res.json({error: true, message: 'Email format is incorrect'});
		} else if (!req.body.password) {
			res.json({error: true, message: 'Password its empty, fill this'});
		} else {
			var user = { 'name': req.body.name, 'email': req.body.email, 'password': req.body.password, 'date': new Date() };
			User.findOne({ 'email': req.body.email }, function(err, doc) {
				if (err) throw err;
      	if (doc) {
					// User is registered
					res.json({error: true, message: 'User registered with this email'});
				} else {
					// Save new user
					var user = new User({
						'name': req.body.name,
						'email': req.body.email,
					  'password': req.body.password,
					  'date': new Date()
					});
					user.save(function(err, doc) {
        		if(err) throw err;
        		res.json(doc);
      		});
				};
			});
		};
  };

	this.logIn = function(req, res) {
		sess = req.session;
		console.log(sess);
		if (!req.body.email) {
			res.json({error: true, message: 'What is your email?'});
		} else if (!validateEmail(req.body.email)) {
			res.json({error: true, message: 'Email format is incorrect'});
		} else if (!req.body.password) {
			res.json({error: true, message: 'Password its empty, fill this'});
		} else {
			User.findOne({ 'email': req.body.email, 'password': req.body.password }, function(err, doc) {
				if (err) throw err;
				if (doc) {
					sess.user = doc;
					res.json(doc);
				} else {
					res.json({error: true, message: 'Email/Password incorrect, try again!'});
				}
			});
		};
	};

	this.checkLogin = function(req, res) {
		sess = req.session;
		if (sess.user) {
			res.json(sess.user);
		} else {
			res.json({error: true, message: 'User not logged'});
		}
	}

	this.logOut = function(req, res) {
		sess = req.session;
		console.log(sess);
		req.session.destroy();
		res.json({logout: true});
	}

	this.initApp = function(req, res) {
		sess = req.session;
		sess.count = (sess.count || 0) + 1;
		console.log(req.session);
		res.sendFile(path + '/public/index.html');
	}

	this.getSearch = function(req, res) {
		var movie = req.params.movie;
		var api_url = "http://www.omdbapi.com/?type=movie&s=" + movie;
		request(api_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body).Search;
				// Filter without posters
				if (data.length) {
					data = data.filter(function(value, index) {
	          return (value.Poster !== 'N/A');
	        });
				}
				res.json(data.slice(0,max_results));
			}
		});
	}

	this.addMovie = function(req, res) {
		sess = req.session;
		if (sess.user) {
			var movie = {
				'title': req.body.Title,
				'imdb_id': req.body.imdbID,
				'year': req.body.Year,
				'date': new Date(),
				'img': req.body.Poster,
				'owner_id': sess.user._id,
				'format': 0
			};
	    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
			Movie.findOneAndUpdate({ 'imdb_id': movie.imdb_id,  'owner_id': movie.owner_id }, movie, options, function(err, result) {
				if (err) { throw err; }
				res.json(result);
	    });
		} else {
			res.json({ error: true, message: 'Unauthorized'});
		}
	}

	this.getMoviesUser = function(req, res) {
		sess = req.session;
		if (sess.user) {
			Movie
	      .find({'owner_id': sess.user._id}, { __v: false })
	      .sort({'date': -1})
	      .exec(function(err, movies) {
	        res.json(movies);
	      });
		} else {
			res.json({ error: true, message: 'Unauthorized'});
		}
  };

	this.delMovie = function(req, res) {
		sess = req.session;
		if (sess.user) {
			Movie.findOne({ 'owner_id': sess.user._id, '_id': req.body._id }, function(err, result) {
	    	if (err) throw err;
				if (result) {
					result.remove();
					res.json(result);
				} else {
					res.json({ error: true, message: 'Movie not found'});
				}
	    });
		} else {
			res.json({ error: true, message: 'Unauthorized'});
		}
	}

	this.getMoviesAll = function(req, res) {
		sess = req.session;
		Movie
	  	.find({}, { __v: false })
	    .sort({'date': -1})
			.limit(18)
	    .exec(function(err, movies) {
	    	res.json(movies);
	   	});
  };

	this.toggleLike = function(req, res) {
		var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
		var id = req.params.id;
		if (id) {
			Movie.findOne({ '_id': id  }, function(err, movie) {
				if (err) throw err;
				if (movie) {
					var pos = movie.likes.indexOf(ip);
					if (pos >= 0) {
						movie.likes.splice(pos, 1);
					} else {
						movie.likes.push(ip);
					}
					movie.save();
					res.json({ id: id, ip: ip, likes: movie.likes.length });
				} else {
					res.json({ error: true, message: 'Movie not found' });
				}
			})
		} else {
			res.json({ error: true, message: 'Param id required' });
		}
	}

	this.putTradeIt = function(req, res) {
		sess = req.session;
		if (sess.user) {
			var id = req.params.id;
			Movie.findOne({ '_id': id }, function(err, movie) {
	    	if (err) throw err;
				if (movie) {
					// TODO: movie.hasOwnProperty('requested'), return FALSE ¿Why?
					if (!isEmpty(movie.requested)) {
						res.json({ error: true, message: 'Movie has a request'});
					} else if (movie.owner_id === sess.user._id) {
						res.json({ error: true, message: 'You are the owner of movie'});
					} else {
						movie.requested = {
							accepted: false,
							user_id: sess.user._id,
							date: new Date()
						};
						movie.save();
						res.json(movie);
					}
				} else {
					res.json({ error: true, message: 'Movie not found'});
				}
	    });
		} else {
			res.json({ error: true, message: 'Unauthorized'});
		}
	}

	this.putUnTrade = function(req, res) {
		sess = req.session;
		if (sess.user) {
			var id = req.params.id;
			Movie.findOne({ '_id': id }, function(err, movie) {
	    	if (err) throw err;
				if (movie) {
					if (isEmpty(movie.requested)) {
						res.json({ error: true, message: 'Movie not has a request'});
					} else if (movie.owner_id !== sess.user._id || movie.requested.user_id !== sess.user._id) {
						res.json({ error: true, message: 'You are not the owner of movie'});
					} else {
						movie.requested = undefined;
						movie.save();
						res.json(movie);
					}
				} else {
					res.json({ error: true, message: 'Movie not found'});
				}
			});
		} else {
			res.json({ error: true, message: 'Unauthorized'});
		}
	}

	this.getTradeIn = function(req, res) {
		sess = req.session;
		if (sess.user) {
			Movie.find({ owner_id: sess.user._id, requested: {$exists: true} }, function(err, movies) {
				if (err) throw err;
				res.json(movies);
			});
		} else {
			res.json({ error: true, message: 'Unauthorized'});
		}
	}

	this.getTradeOut = function(req, res) {
		sess = req.session;
		if (sess.user) {
			Movie.find({ "requested.user_id": sess.user._id }, function(err, movies) {
				if (err) throw err;
				res.json(movies);
			});
		} else {
			res.json({ error: true, message: 'Unauthorized'});
		}
	}

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

}

module.exports = MovieSwap;
