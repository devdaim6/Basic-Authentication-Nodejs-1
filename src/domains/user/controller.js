const User = require('./model')
const { hashData, verifyHashedData } = require('../../util/hashData')
const createToken = require('./../../util/createToken')
const uuid = require('uuid')
const authenticateUser = async (req, res, data) => {

    try {
        const { email, password } = data;

        const fetchedUser = await User.findOne({ email })

        if (!fetchedUser) {
            res.status(401).json({ message: "No account assosciated with this Email.Create a new One!" })
        }
        if (!fetchedUser.verified) {
            res.status(402).json({ message: "Email is Not Verified Yet!" })
        }

        const hashedPass = fetchedUser.password
        const passwordMatch = await verifyHashedData(password, hashedPass)

        if (!passwordMatch) {
            res.status(403).json({ message: "Invalid Credentials Entered!" })
        }
        //craete user token
        const tokenData = { userId: fetchedUser._id, email }
        const token = await createToken(tokenData)
        const tokenSecret = await uuid.v4()

        fetchedUser.secret = tokenSecret;
        fetchedUser.token = token;
        return fetchedUser

    } catch (error) {
        throw error
    }
}
const createNewUser = async (data) => {
    try {
        const { name, email, password } = data;

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            // res.status(403).json({message:"User Already Existing with this Email"})
            throw Error("User already exists")
        }


        //hash pass

        const hashedPass = await hashData(password);

        const newUser = new User({
            name,
            email,
            password: hashedPass,
        })
        const createdUser = await newUser.save()
        return createdUser;

    } catch (error) {
        throw error
    }
}

// const LogoutUser=async(data)=>{
//     try {
//         const {email}=data;

//         const existingUser=await User.findOne({email})
//         if(existingUser){
//             throw Error("Login first!")
//         }

//        const logout=await 
//         return logout;

//     } catch (error) {
//         throw error
//     }
// }



module.exports = { createNewUser, authenticateUser }