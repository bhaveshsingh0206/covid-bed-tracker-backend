const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
   passport.use(
      new localStrategy((username, password, done) => {
         Admin.findOne({ username: username }, (err, user) => {
            if (err) throw err;
            if (!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {
               if (err) throw err;
               if (result === true) return done(null, user);
               else return done(null, false);
            });
         });
      })
   );

   passport.serializeUser((user, done) => {
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
      Admin.findById(id, (err, user) => {
         const userInformation = {
            id: user._id,
            username: user.username,
         };
         done(err, userInformation);
      });
   });
};