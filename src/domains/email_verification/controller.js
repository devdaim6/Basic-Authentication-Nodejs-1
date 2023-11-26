const { createTestAccount } = require('nodemailer')
const { sendOtp, verifyOtp, deleteOtp } = require('../otp/controller')
const User = require('./../user/model')
const sendVerificationOTPEmail = async (email) => {
    try {
        const existingUser = await User.findOne({ email })

        if (existingUser?.verified) {
            return "Account is already verified"

        }
        if (!existingUser)
            return "There is no account existing with provided email"

        const otpDetails = {
            email,
            subject: "Email verification",
            message: "verify your email with the code below.",
            duration: "1",
        }

        const createdOtp = await sendOtp(otpDetails)
        return createdOtp
    } catch (error) {
        console.log(error)
    }
}


const verifyUserEmail = async (email, otp) => {
    try {
        // Ensure that email is a string
        const validOtp = await verifyOtp(email, otp);

        /* //! This took me i think 1 year to fix this issue */
        // ! I was passing email as email and it was an object

        if (!validOtp) {
            return "Invalid code passed. Check your inbox."
        }
        await User.findOneAndUpdate({ email }, { verified: true })
        return true;
    } catch (error) {
        throw new Error(`Error verifying user email: ${error.message}`);
    }
};

module.exports = { sendVerificationOTPEmail, verifyUserEmail }