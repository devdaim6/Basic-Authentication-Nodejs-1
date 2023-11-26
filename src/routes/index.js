const express=require('express')
const router=express.Router()

/* These lines of code are importing the route handlers for different domains or functionalities of the
application. */
const userRoutes = require("./../domains/user")
const otpRoutes = require("./../domains/otp")
const EmailVerificationRoutes = require("./../domains/email_verification")
const ForgotPasswordRoute = require("./../domains/forgot_password")

/* These lines of code are setting up routes for different domains or functionalities of the
application using the Express Router. */

router.use("/user",userRoutes)
router.use("/otp",otpRoutes)
router.use("/email_verification",EmailVerificationRoutes)
router.use("/forgot_password",ForgotPasswordRoute)

module.exports = router ;