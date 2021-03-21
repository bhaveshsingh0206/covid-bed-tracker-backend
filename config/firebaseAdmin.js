var admin = require("firebase-admin");

var serviceAccount = require("/workspace/covid-bed-tracker/utils/covid-bed-firebase-adminsdk-cgofd-1ec0267f5a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
storageBucket: "covid-bed.appspot.com"
});


// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
  bucket
}