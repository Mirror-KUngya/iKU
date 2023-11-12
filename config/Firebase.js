var admin = require("firebase-admin");

var serviceAccount = require("./ikufdb-firebase-adminsdk-ouo7c-c286d8b51d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ikufdb-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin;
