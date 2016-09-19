'use strict';

require('dotenv').config();

let express = require("express");
let app = express();

const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));

function generateRandomString() {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (var i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }

  return randomString;
}

let db_url;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    throw new Error("Could not connect! Unexpected error.")
  }

  db_url = db.collection('urls');
});

function getLongURL(db, shortURL, cb) {
  let query = { "shortURL": shortURL };
  db.findOne(query, (err, result) => {
    if (err) {
      return cb(err);
    }
    return cb(null, result.longURL);
  });
}

app.get("/", (req, res) => {
  res.redirect("/urls/new");
});

app.get("/urls", function(req, res) {
  let collectionOfKeyValues = {};

  db_url.find().toArray((err, results) => {
    for (let i = 0; i < results.length; i++) {
      collectionOfKeyValues[results[i].shortURL] = results[i].longURL;
    }

    let templateVars = { urls: collectionOfKeyValues };
    res.render('urls_index', templateVars);
  });
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/create", (req, res) => {
  let shortURL = generateRandomString();

  db_url.insert({ "shortURL": shortURL, "longURL": req.body["longURL"] });

  res.redirect(shortURL);
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;

  getLongURL(db_url, shortURL, (err, longURL) => {
    let templateVars = { urlInfo: shortURL,
      longUrlInfo: longURL };

    res.render('urls_show', templateVars);
  });
});

app.put("/urls/:id", (req, res) => {
  db_url.update({ "shortURL": req.url.substring(6, 12)},
    { "shortURL": req.url.substring(6, 12),
      "longURL": res.req.body["long URL"]
  });

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  db_url.find().toArray((err, results) => {
    if (err) {
      throw new Error("Could not get collection or convert to an array.")
    }

    results.forEach((element) => {
      if (element["shortURL"] === req.url.substring(3, 9)) {
        res.redirect(element["longURL"]);
      }
    });
  });
});

app.delete("/urls/:id", (req, res) => {
  db_url.remove({ "shortURL": req.url.substring(6, 12) });

  res.redirect("/urls");
});

app.listen(8080);
console.log('8080 is the magic port');