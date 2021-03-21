const Bed = require('../models/Bed');
const express = require('express');
const router = express.Router();
const verify = require('../config/verifyToken');


/**
 * @description Add bed
 * @method post
 * @param hospitalId The hospital id of the bed
 * @param status The status of the bed
 * @param status The type of the bed
 * @returns JWT Token
 * @see passport.js
 */
router.post('/add', async (req, res) => {
	try {
		const { hospitalId, status, type } = req.body;
		const newBed = Bed({
			hospitalId,
			status,
			type,
		});
		await newBed.save();
		res.status(200).send('Bed Added');
	} catch (err) {
		res.status(400).json({ err });
	}
});

router.get('/free', async (req, res) =>{
	try{
		await Bed.updateMany({status: 0})
		
		res.status(200).json({ message:"Done" });
	} catch (err) {
		res.status(400).json({ err });
	}
})

// router.post('/testBeds', async (req, res) => {
// 	try{

// 		const { id } = req.body;
// 		const beds = await Bed.find({hospitalId: id});

// 		let freeBeds = 0;
// 		let resBeds = 0;
// 		let bookedBeds = 0;
// 		let normal = 0;
// 		let icu = 0;
// 		let nonicu = 0;

// 		beds.forEach((bed) => {
// 			if(bed.status == 0) freeBeds++;
// 			else if(bed.status == 1) resBeds++;
// 			else bookedBeds++;

// 			if(bed.type == 0) normal++;
// 			else if(bed.type == 1) nonicu++;
// 			else icu++;

// 		});

// 		console.log(`Free Beds : ${freeBeds}\nReserved Beds : ${resBeds}\nBooked Beds : ${bookedBeds}\nNormal Beds : ${normal}\nNon ICU Beds : ${nonicu}\nICU Beds : ${icu}\n------------------\n`)
// 		res.status(200).send('Test Done');
// 	}catch(err){
// 		res.status(400).json({ err });
// 	}
// });

module.exports = router;