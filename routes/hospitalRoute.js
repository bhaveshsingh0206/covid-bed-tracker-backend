const Hospital = require('../models/Hospital');
const Bed = require('../models/Bed');
const express = require('express');
const router = express.Router();
const verify = require('../config/verifyToken');

/**
 * @description Add hospital
 * @method post
 * @param name The name of the hospital
 * @param address The address of the hospital
 * @param latt The latitude of the hospital
 * @param long The longitude of the hospital
 * @param totalBeds The total no. of beds of the hospital
 * @param freeBeds The no. of free beds of the hospital
 * @returns JWT Token
 * @see passport.js
 */
router.post('/add', async (req, res) => {
	try {
		const { name, address, latt, long, totalBeds, freeBeds, city } = req.body;
		const sameHospital = await Hospital.findOne({ address: address });
		if (sameHospital) res.status(400).json({ err: 'Hospital exists' });
		const newHospital = Hospital({
			name,
			address,
			latt,
			long,
			totalBeds,
			freeBeds,
			city
		});
		await newHospital.save();
		res.status(200).send('Hospital Added');
	} catch (err) {
		res.status(400).json({ err });
	}
});

router.get('/all', async (req, res) => {
	try {
		const hospitals = await Hospital.find();
		// console.log(hospitals);
		res.status(200).json({ status: 1, data: hospitals, message: 'Data Fetched'  });
	} catch (err) {
		res.status(404).json({ status: 0, message: 'Data could not be fetched' });
	}
});

router.get('/:hospitalId', async (req, res) => {
	try {
		const hospitalDetail = await Hospital.findById(req.params.hospitalId);
		
		
		const totalnormalbeds = await Bed.count({hospitalId: hospitalDetail._id, type: 0})
		const totalicubeds = await Bed.count({hospitalId: hospitalDetail._id, type: 2})
		const totalicuwithoutbeds = await Bed.count({hospitalId: hospitalDetail._id, type: 1})
		
		const freenormalbeds = await Bed.count({hospitalId: hospitalDetail._id, type: 0, status:0})
		const freeicubeds = await Bed.count({hospitalId: hospitalDetail._id, type: 2, status:0})
		const freeicuwithoutbeds = await Bed.count({hospitalId: hospitalDetail._id, type: 1, status:0})
		
		data = {_id: hospitalDetail._id, name:hospitalDetail.name, address:hospitalDetail.address, latt:hospitalDetail.latt, long:hospitalDetail.long, totalBeds:hospitalDetail.totalBeds, freeBeds:hospitalDetail.freeBeds, totalnormalbeds:totalnormalbeds, totalicubeds:totalicubeds, totalicuwithoutbeds:totalicuwithoutbeds, freenormalbeds:freenormalbeds, freeicubeds, freeicuwithoutbeds:freeicuwithoutbeds }
		
		res.status(200).json({ status: 1, data: data, message: 'Data Fetched'  });
	} catch (err) {
		res.status(404).json({ status: 0, message: 'Data could not be fetched' });
	}
});


module.exports = router;