const express = require('express')
const router=express.Router();
const {sendOtp, verifyOtp}=require('./controller')

router.post('/verify',async(req,res)=>{
    try {
        let {email,otp}=req.body;
        const validOtp=await verifyOtp({email,otp})
        res.status(200).send({valid:validOtp}) 
        
    } catch (error) {
        res.status(400).send(error.message) 
        
    }
})
router.post('/',async(req,res)=>{
    try {
        const {email,subject,message,duration}=req.body;

            const createdOtp = await sendOtp({
                email,
                subject,
                message,
                duration
            })
            res.status(200).json(createdOtp)
        } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports=router;
