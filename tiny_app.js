'use strict';

let express = require("express");
let app = express();

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//MONGO-DB
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";

//Needs to change
// let urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };


function generateRandomString() {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (var i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }

  return randomString;
}

function getLongURL(db, shortURL, cb) {
  let query = { "shortURL": shortURL };
  db.collection("urls").findOne(query, (err, result) => {
    if (err) {
      return cb(err);
    }
    return cb(null, result.longURL);
  });
}

app.get('/urls', function(req, res) {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      throw new Error("Could not connect! Unexpected error.")
    }

    const urls = db.collection('urls');
    let collectionOfKeyValues = {};

    urls.find().toArray((err, results) => {
      for (let i = 0; i < results.length; i++) {
        collectionOfKeyValues[results[i].shortURL] = results[i].longURL;
      }

      let templateVars = { urls: collectionOfKeyValues };
      res.render('urls_index', templateVars);
    });
  });
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/create", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      throw new Error("Could not connect! Unexpected error.")
    }

    let shortURL = generateRandomString();

    db.collection("urls").insert({ "shortURL": shortURL, "longURL": req.body["longURL"] });

    res.redirect(shortURL);
  });
});

app.get("/urls/:id", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      throw new Error("Could not connect! Unexpected error.")
    }

    let shortURL = req.params.id;

    getLongURL(db, shortURL, (err, longURL) => {
      let templateVars = { urlInfo: shortURL,
        longUrlInfo: longURL };

      res.render('urls_show', templateVars);
    });
  });
});

app.put("/urls/:id", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      throw new Error("Could not connect! Unexpected error.")
    }

    db.collection("urls").update({ "shortURL": req.url.substring(6, 12)},
      { "shortURL": req.url.substring(6, 12),
        "longURL": res.req.body["long URL"]
    });

    res.redirect("/urls");
  });
});

app.get("/u/:shortURL", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      throw new Error("Could not connect! Unexpected error.")
    }

    const urls = db.collection('urls');

    urls.find().toArray((err, results) => {
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
});

app.delete("/urls/:id", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      throw new Error("Could not connect! Unexpected error.")
    }

    db.collection("urls").remove({ "shortURL": req.url.substring(6, 12) });

    res.redirect("/urls");
  });
});

app.listen(8080);
console.log('8080 is the magic port');