function obtainLongURL(db, shortURL, cb) {
  let query = { "shortURL": shortURL };
  db.findOne(query, (err, result) => {
    if (err) {
      return cb(err);
    }
    return cb(null, result.longURL);
  });
}

module.exports = obtainLongURL;