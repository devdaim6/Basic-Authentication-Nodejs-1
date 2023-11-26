const express = require('express');
const { sendVerificationOTPEmail, verifyUserEmail } = require('./controller');
const { deleteOtp } = require('../otp/controller');
const router = express.Router();



router.post('/verify', async (req, res) => {
    try {
        let { email, otp } = req.body;
        if (!(email && otp)) {
            throw Error("Empty Otp Details are not Allowd")
        }

        const userVerified = await verifyUserEmail(email, otp);

        if (userVerified)
            await deleteOtp(email);

        res.status(200).json({ email, verified: true });

    } catch (error) {
        res.status(400).send(error.message)

    }
})



router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw Error("An Email is Required")
        }

        const createdEmailverificationOtp = await sendVerificationOTPEmail(email)
        res.status(200).json(createdEmailverificationOtp)

    } catch (error) {
        res.status(400).send(error.message)

    }
})

module.exports = router