//Require database package
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create Article objecy to store title, date and url
var articleSchema = new Schema({
  title: String,
  date: Date,
  url: String
});

//Article collection to store articles in DB
var Article = mongoose.model("Article", articleSchema);

//Export Article collection
module.exports = Article;
