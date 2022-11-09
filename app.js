const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = new mongoose.model("Article", articleSchema);

//////////////////////////////////////////////////////Requests Targetting all Articles//////////////////////////////////////////////////////////////////////

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, results) {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err) {
      if (!err) {
        res.send("Sucessfully added a new article.");
      } else {
        res.send(err);
      }
    })
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.")
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////////////////////////////////Requests Targetting a Specific Article////////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, result) {
      if (!err) {
        if (result) {
          res.send(result);
        } else {
          res.send("No articles matching that title were found.");
        }
      } else {
        res.send(err);
      }
    });
  })
  .put(function(req, res) {
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err) {
        if (!err) {
          res.send("Successfully updated specified article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err) {
        if (!err) {
          res.send("Successfully updated specified article.");
        } else {
          res.send(err);
        }
    });
  })
  .delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
      if (!err) {
        res.send("Successfully deleted specified article.")
      } else {
        res.send(!err);
      }
    });
  });

app.listen(3000, function() {
  console.log("Successfully started server on port 3000")
});
