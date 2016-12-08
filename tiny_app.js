'use strict';

require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
const cookieParser = require('cookie-parser');

let app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static("views"));

// Function that generates a six character string for a new url
const createNewShortUrl = require("./string_generate");

// Function that retrieves the correct long url for a given short url
const getLongURL = require("./obtain_long_url");

let db_url;
var username;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    throw new Error("Could not connect! Unexpected error.")
  }

  db_url = db.collection('urls');
});

app.get("/", (req, res) => {
  res.redirect("/urls/new");
});

app.get("/urls", function(req, res) {
  let collectionOfKeyValues = {};

  db_url.find().toArray((err, results) => {
    for (let i = 0; i < results.length; i++) {
      collectionOfKeyValues[results[i].shortURL] = results[i].longURL;
    }

    let templateVars = { urls: collectionOfKeyValues,
      username: req.cookies["username"] };

    res.render('urls_index', templateVars);
  });
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  createNewShortUrl(db_url, (shortURL) => {
    db_url.insert({ "shortURL": shortURL, "longURL": req.body["longURL"] });

    res.redirect("/urls");
  });
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;

  getLongURL(db_url, shortURL, (err, longURL) => {
    let templateVars = { urlInfo: shortURL,
      longUrlInfo: longURL,
      username: req.cookies["username"] };

    res.render('urls_show', templateVars);
  });
});

app.put("/urls/:id", (req, res) => {
  db_url.update({ "shortURL": req.params.id},
    { "shortURL": req.params.id,
      "longURL": res.req.body["long URL"]
  });

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  db_url.findOne({ "shortURL": req.params.shortURL }, (err, result) => {
    if (!result) {
      throw new Error("Could not find document requested.");
    }

    res.redirect(result.longURL);
  });
});

app.delete("/urls/:id", (req, res) => {
  db_url.remove({ "shortURL": req.params.id });

  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username, { maxAge: 900000, httpOnly: true });
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

app.listen(8080);
console.log('8080 is the magic port');