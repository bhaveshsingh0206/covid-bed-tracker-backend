const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   joined: {
      type: Date,
      default: Date.now,
   },
   hospitalId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Hospital',
		required: true,
	},
});

module.exports = mongoose.model('Admin', AdminSchema);