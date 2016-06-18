'use strict';

var request = require('request');

var path = process.cwd();
var User = require('../models/users.js');
var Movie = require('../models/movies.js');
var sess;

function MovieSwap () {

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
		delete sess.user;
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
				data = data.filter(function(value, index) {
          return (value.Poster !== 'N/A');
        });
				// Only four results
				data = data.filter(function(value, index) {
					return (index < 4);
				});
				res.json(data);
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
