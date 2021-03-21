const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   uid: {
      type: String,
      required: true
   },
	mobileNumber:{
		type: String,
		required: true,
		unique: true,
	}, 
});

module.exports = mongoose.model('User', UserSchema);