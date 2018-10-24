// Require Dependecies express, mongoose, body-parser, bluebird, path
const express = require('express');
const mongoose = require("mongoose");
const bluebird = require("bluebird");
const bodyParser = require("body-parser");
const path = require("path");


// Set up a default port, configure mongoose, configure our middleware
const PORT = process.env.PORT || 3001;
mongoose.Promise = bluebird;
const app = express();

app.use(bodyParser.urlencoded({ entended: true }));
app.use(bodyParser.json());

// Serve up static assets if in production (running on Heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
} else {
  app.use(express.static(__dirname + "/client/public"));
}

// enable CORS, use:
// https://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next();
});


//Routing -- Requires CRUD function for article collection from controllers
var articlesController = require('./server/controllers/article-controller.js');
var router = new express.Router();


//Define API routes, GET/POST to read/create saved articles
// GET saved
router.get("/api/saved", articlesController.find);
// POST saved
router.post("/api/saved", articlesController.insert);
//DELETE saved
router.delete("api/saved/:id", articlesController.delete);
// Send every other request to React app
router.get("/*", function(req, res){
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Ensure the express app actually uses the routes
app.use(router);

// Connect mongoose to our database && create new database 'nytreact if non existent'
const db = process.env.MONGODB_URI || "mongodb://localhost/nytreact";

mongoose.connect(db, function(error) {
  if(error) {
    console.error(error);
  } else {
    console.log('SUCCESSFUL DATABASE CONNECTION');
  }
});

app.listen(PORT, function() {
  console.log(`Server running on port ==> ${PORT}`);
})
