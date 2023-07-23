const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt =  require('bcrypt')

const userschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    picture:{
        type:String ,
        default:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    }
},{
    timestamps:true
})

userschema.methods.generateToken = async function(id){
    const a = id.toString()
    const token =  jwt.sign({_id:a},"goutham")
    return token
}

userschema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userschema.methods.toJSON = function(){
    const userObject = this.toObject()

    delete userObject.password
    
    return userObject
}

userschema.pre('save',async function(next){
    if(!this.isModified){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})


const User = mongoose.model("User",userschema)

module.exports = User