const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
   const token = req.header('auth-token');
   if (!token) res.status(401).send('Access Denied');
   else {
      try {
         const verified = jwt.verify(token, process.env.TOKEN_SECRET);
         req.user = verified;
		  // console.log("Verify ",verified)
         next();
      } catch (err) {
         res.status(400).send('Invalid Token');
      }
   }
};