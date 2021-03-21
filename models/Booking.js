// name
// aadhar card
// mobile
// pdf -> file
// a
// hospital id

// covidTrace -> 0 -> No contact, 1-> came from foreign country, 2 -> came in contact
// store time for reserv

const mongoose = require('mongoose');
function addHours(t) {
  t.setTime(t.getTime() + (6*60*60*1000));
  return t;
}
const BookingSchema = mongoose.Schema({
	type: {
		type: Number,
		required: true, //0 -> Normal, 1 -> Without Venti ICU, 2 -> Venti ICU 
	},
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	bedId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bed',
		required: true,
	},
	pdfLink: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true,
	},
	hospitalId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Hospital',
		required: true,
	},
	covidTrace: {
		type: Number,
		required: true, //0 -> No contact, 1-> came from foreign country, 2 -> came in contact
	},
	aadharCard: {
		type: String,
		required: true, 
	},
	mobile: {
		type: String,
		unquie: true,
		required: true,  
	},
	bookingTime: {
		type: Date,
		default: addHours(new Date()),
	},
	age: {
		type: Number,
		required: true,  
	},
	isAccepted: {
		type: Number,
		required: true,
		default: 0, // 0 -> Pending, 1 -> Accepted, 2 -> Rejected
	},
	isActive: {
		type: Number,
		required: true, 
		default: 0, // 0 -> Inactive, 1 -> Active
	}
});

module.exports = mongoose.model('Booking', BookingSchema); 