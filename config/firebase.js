const firebase = require("firebase");

var firebaseConfig = {
    apiKey: "AIzaSyDc5qPlJAVQcQbDYxt2nEZJ8KKQc9dayRs",
    authDomain: "covid-bed.firebaseapp.com",
    projectId: "covid-bed",
    storageBucket: "covid-bed.appspot.com",
    messagingSenderId: "854753753142",
    appId: "1:854753753142:web:7f78857621bb6ffea58097",
    measurementId: "G-GG46GSJ08F"
  };
console.log(firebase.apps.length)

module.exports = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()