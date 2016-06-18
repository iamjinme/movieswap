'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Movie = new Schema({
  title: String,
  imdb_id: String,
  year: Number,
  date: Date,
  img: String,
  owner_id: String,
  requested: {
    accepted: Boolean,
    user_id: String,
    date: Date
  },
  likes: Array,
  format: Number // CD, DVD, Blu-ray
});

module.exports = mongoose.model('Movie', Movie);
