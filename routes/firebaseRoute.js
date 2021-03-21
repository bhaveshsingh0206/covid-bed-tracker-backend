const express = require('express');
const router = express.Router();
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

firebase.initializeApp(firebaseConfig);
// const applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

router.get('/sendOTP/:mobileNumber', async (req, res)=>{
	const mobileNumber = req.params.mobileNumber;
	await firebase.auth().signInWithPhoneNumber(mobileNumber)
    .then((confirmationResult) => {
      console.log(confirmationResult)
      
      
    }).catch((error) => {
      console.log(error)
    });
})

module.exports = router;