'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Movie = new Schema({
  title: String,
  year: Number,
  date: Date,
  owner_id: Number,
  requested: {
    status: Boolean,
    user_id: Number,
    date: Date
  }
  likes: Number
});

module.exports = mongoose.model('Movie', Movie);
