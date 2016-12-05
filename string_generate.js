function generateRandomString() {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (var i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }

  return randomString;
}

module.exports = generateRandomString;