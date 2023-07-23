const jwt = require('jsonwebtoken')
const User = require('../models/usermodel')

const auth = async (req,res,next)=>{
   
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            
            const token = req.headers.authorization.split(" ")[1];
            
            const decoded = jwt.verify(token,"goutham")

            req.user = await User.findOne({_id:decoded._id}).select('-password')
            
            next()
        } catch (error) {
            res.status(401).send("not authorized")
        }
    }
    else{
        res.status(401).send("not authorized")
    }
}

module.exports = {auth}