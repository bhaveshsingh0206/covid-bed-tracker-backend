const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verify = require('../config/verifyToken');

/**
 * @description Login
 * @method post
 * @param username The username of the user
 * @param password The password of the user
 * @returns JWT Token
 * @see passport.js
 */
router.post('/save', async (req, res) => {
    let userUid = req.body.uid;
    let mobileNumber = req.body.mobileNumber;
	console.log(req.body)
    const newUser = User({
        uid: userUid,
        mobileNumber: mobileNumber,
    });
    await newUser.save((err, user) => {
        if (!err) {
            console.log(user);
            const token = jwt.sign(
                {
                    id: user._id,
					username: mobileNumber
                },
                process.env.TOKEN_SECRET
            );
		
            res.status(200).json({
                status: 1,
                message: 'User created and saved',
                userToken: token,
            });
        } else {
            User.find({mobileNumber:mobileNumber},(err, user)=>{
				if(!err) {
					console.log(user)
				const token = jwt.sign(
                {
                    
                    id: user[0]._id,
					username: user[0].mobileNumber
                },
                process.env.TOKEN_SECRET
            	);
            res.status(200).json({
                status: 1,
                message: 'User Found',
                userToken: token,
            });
				} else {
					res.status(404).json({
                status: 0,
                message: 'User not found'
				})
			}
    });
		}
});
	});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        // console.log(hospitals);
        res.status(200).json({ status: 1, data: users, message: 'Data Fetched' });
    } catch (err) {
        res.status(404).json({ status: 0, message: 'Data could not be fetched' });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.status(404).send('Invalid Credentials');
        else {
            req.logIn(user, (err) => {
                if (err) res.send({ err });
                const token = jwt.sign(
                    {
                        id: req.user._id,
                        username: req.user.username,
                    },
                    process.env.TOKEN_SECRET
                );
                res.header('auth-token', token).send(token);
            });
        }
    })(req, res, next);
});

/**
 * @description Register
 * @method post
 * @param username The username of the user
 * @param email The email address of the user
 * @param password The password of the user
 * @returns The user
 */
router.post('/registerAdmin', async (req, res) => {
    try {
        const { username, password, hospitalId } = req.body;

        // Check username
        const sameUsername = await Admin.findOne({ username: username });
        if (sameUsername) res.status(400).json({ err: 'Username is taken' });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register user
        const newUser = new Admin({
            username,
            password: hashedPassword,
            hospitalId,
        });
        await newUser.save();
        res.status(200).send('Account created, please login');
    } catch (err) {
        res.status(400).json({ err });
    }
});

/**
 * @description Gets currently logged in user
 * @method get
 * @protected
 * @returns Currently logged in user
 */
router.get('/', verify, async (req, res) => {
	const { id, username } = req.user;
    try {
		// console.log(req.user)
        
		console.log(req.user)
        const user = await Admin.findById(id);
        res.status(200).send({
            id: user._id,
            username: user.username,
            type: 1,
        });
    } catch (err) {
		const user = await User.findById(id)
        res.status(200).send({
            id: user._id,
            username: username,
			type: 0
        });
    }
});

module.exports = router;