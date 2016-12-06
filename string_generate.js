'use strict';

function generateRandomString(db, cb) {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  // Generates a random short URL
  for (var i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }

  // Checks if the newly generated short URL is already in the database
  // The function calls itself if there is a duplicate
  // The callback is executed if the newly generated URL is unique
  db.findOne({ "shortURL": randomString }, (err, result) => {
    if (result) {
      return generateRandomString(db, cb);
    } else {
      return cb(randomString);
    }
  });
}

module.exports = generateRandomString;