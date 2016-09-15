'use strict';

let express = require("express");
let app = express();

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (var i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }

  return randomString;
}

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/create", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters

  let shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body["longURL"];

  console.log(urlDatabase);

  //res.send(shortURL);         // Respond with 'Ok' (we will replace this)

  res.redirect(shortURL);
});

app.get("/urls/:id", (req, res) => {
  let statement = { info: "A short URL has been added to the database!"};
  res.render("urls_show", statement);
});

app.get("/u/:shortURL", (req, res) => {
  let key = req.url.substring(3,9);
  let longURL = urlDatabase[key];

  // console.log(key);
  // console.log(longURL);
  res.redirect(longURL);
});

app.listen(8080);
console.log('8080 is the magic port');