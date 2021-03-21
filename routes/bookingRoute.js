const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Admin = require('../models/Admin');
const Hospital = require('../models/Hospital');
const Bed = require('../models/Bed');
const schedule = require('node-schedule');
const log = require('../log');
const verify = require('../config/verifyToken');
const bucket = require('../config/firebaseAdmin');
const axios = require('axios').default;
const moment = require('moment');

schedule.scheduleJob('30 * * * *', async () => {
	// this for one hour
	log.log('scheduler', 'Starting task');
	try {
		const bookings = await Booking.find({ bookingTime: { $lte: Date.now() } });
		log.log('scheduler', `overdue reserved beds found ${bookings.length}`);
		bookings.forEach(async (booking) => {
			let newStatus = 0;
			if (booking.isActive === 1) newStatus = 2;
			if (newStatus == 0) {
				const myHospital = await Hospital.find({ _id: booking.hospitalId });
				const myFreeBeds = myHospital.freeBeds + 1;
				Hospital.findByIdAndUpdate(booking.hospitalId, { freeBeds: myFreeBeds });
			}
			await Bed.findByIdAndUpdate(booking.bedId, { status: newStatus });
		});

		log.log('scheduler', 'End of task');
	} catch (err) {
		res.status(400).json({ err });
	}
});



// moment("2021-08-17", 'YYYY-MM-DD').format('DD,MMM,YYYY');s


router.get('/getActiveCase', (req, res) => {
	console.log('getActiveCase');
	axios
		.get('https://api.rootnet.in/covid19-in/stats/history')
		.then(function (response) {
			let prev = 0;
			let prevRecov = 0
			let activedata = [['Day','Active Cases']];
			let recoveryData = [['Day', 'Recover Cases']]
			// console.log(response.data);
			response['data']['data'].forEach((day, i) => {
				let obj = [moment(day.day, 'YYYY-MM-DD').format("MMM DD, YYYY"), day.summary.total - prev] ;
				let objData = [moment(day.day, 'YYYY-MM-DD').format("MMM DD, YYYY"), day.summary.discharged-prevRecov]
				prev = day.summary.total;
				prevRecov = day.summary.discharged
				activedata.push(obj);
				recoveryData.push(objData)
				if (i == response['data']['data'].length - 1) {
					res.status(200).json({ activeData: activedata, recoveryData:recoveryData});
				}
			});
		})
		.catch(function (error) {
			res.status(400).json({});
			console.log(error);
		});
});
router.get('/all', verify, async (req, res) => {
	try {
		const { id, username } = req.user;
		Admin.findById(id, (err, admin) => {
			if (!err) {
				Booking.find({ hospitalId: admin.hospitalId }, (err, bookings) => {
					if (!err) {
						res.status(200).json({ message: 'Fetched', data: bookings });
					} else {
						res.status(400).json({ message: 'No data', err: err });
					}
				});
			} else {
				res.status(400).json({ message: 'No data', err: err });
			}
		});
	} catch (err) {
		res.status(400).json({ message: 'No data', err: err });
	}
});

router.get('/userBookings', verify, async (req, res) => {
	console.log('Here');
	try {
		console.log(req.user);
		console.log(`verify: ---------`);
		const { id } = req.user;
		const bookings = await Booking.find({ userId: id });
		res.status(200).json({ data: bookings });
	} catch (err) {
		res.status(400).json({ err });
	}
});

router.post('/reserve', verify, async (req, res) => {
	try {
		console.log('Reserving');
		// console.log(req.files);
		// console.log(req.body);
		// console.log(req.user)
		const { id, username } = req.user;

		const { type, pdfLink, name, hospitalId, covidTrace, aadharCard, age } = req.body;
		const beds = await Bed.find({ hospitalId, type, status: 0 });
		let bedId;
		if (beds) {
			// console.log(bedId)
			bedId = beds[0]._id;

			const newBooking = new Booking({
				userId: id,
				type,
				bedId,
				pdfLink,
				name,
				hospitalId,
				covidTrace,
				aadharCard,
				mobile: username,
				age,
			});

			newBooking.save((err, booking) => {
				if (!err) {
					// console.log("Booking done")
					Bed.findByIdAndUpdate(bedId, { status: 1 }, () => {
						Hospital.findById(hospitalId, (err, hospital) => {
							console.log(hospital);
							if (!err) {
								Hospital.findByIdAndUpdate(
									hospitalId,
									{ freeBeds: hospital.freeBeds - 1 },
									() => {
										res.status(200).send({ status: true, booking:newBooking });
									}
								);
							} else {
								res.status(400).send({ status: false });
							}
						});
					});
				} else {
					res.status(400).send({ status: false });
				}
			});
		} else {
			console.log('Booking not done');
			res.status(200).send({ status: false, message: 'No Rooms found' });
		}
	} catch (err) {
		console.log(err);
		res.status(400).json({ err });
	}
});

router.post('/update', verify, async (req, res) => {
	try {
		const { isAccepted, bookingId } = req.body;
		let isActive = 0;
		if (isAccepted === 2) {
			const booking = await Booking.findByIdAndUpdate(bookingId, {
				isAccepted,
				isActive,
				bookingTime: Date.now(),
			});
			res.status(200).json({ status: true });
		} else {
			const booking = await Booking.findByIdAndUpdate(bookingId, {
				isAccepted,
				isActive: isActive,
			});
			res.status(200).json({ status: true });
		}
	} catch (err) {
		res.status(400).json({ err });
	}
});

router.post('/checkin', verify, async (req, res) => {
	console.log('Checkin');
	try {
		const { bookingId } = req.body;
		console.log('Checkin2');
		const booking = await Booking.findOne({ _id: bookingId });
		console.log('Checkin3');
		const bed = await Bed.findOne({ _id: booking.bedId });
		console.log('Checkin4');
		await Bed.findByIdAndUpdate(booking.bedId, { status: 2 });
		await Booking.findByIdAndUpdate(bookingId, {isActive: 1});
		console.log('Checkin5');
		res.status(200).send(booking);
	} catch (err) {
		res.status(400).json({ err });
	}
});

router.post('/checkout', async (req, res) => {
	try {
		const { bookingId } = req.body;
		const booking = await Booking.findByIdAndUpdate(bookingId, { isActive: 0 });
		res.status(200).send(booking);
	} catch (err) {
		res.status(400).json({ err });
	}
});
router.get('/:bookingId', async (req, res) => {
	try {
		const bookingDetail = await Booking.findById(req.params.bookingId)
			.populate('hospitalId', 'name')
			.exec();
		res.status(200).json({ status: 1, data: bookingDetail, message: 'Data Fetched' });
	} catch (err) {
		res.status(404).json({ status: 0, message: 'Data could not be fetched' });
	}
});
module.exports = router;