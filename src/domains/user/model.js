const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const UserSchema= new Schema({
    name:String,
    username:String,
    email:{type:String,unique:true},
    password:String,
    token:String,
    verified:{type:Boolean,default:false},
    
})

const User =mongoose.model("user",UserSchema)



module.exports = User