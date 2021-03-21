const mongoose = require('mongoose');

const HospitalSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
		unique: true,
	},
	latt: {
		type: Number,
		required: true,
	},
	long: {
		type: Number,
		required: true,
	},
	totalBeds: {
		type: Number,
		required: true,
	},
	freeBeds: {
		type: Number,
		required: true,
	},
	city:{
		type: String,
		required: true,
	}
});

module.exports = mongoose.model('Hospital', HospitalSchema);