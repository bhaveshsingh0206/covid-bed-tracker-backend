const mongoose = require('mongoose');

const BedSchema = mongoose.Schema({
	hospitalId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Hospital',
		required: true,
	},
	status: {
		type: Number,
		required: true, //0 -> Free, 1 -> Reserved, 2 -> Booked
	},
	type: {
		type: Number,
		required: true, //0 -> Normal, 1 -> Without Venti ICU, 2 -> Venti ICU 
	},
	currentReservation: {
		type: Date,
		default: Date.now,
	}
});

module.exports = mongoose.model('Bed', BedSchema); 