const User = require('../models/usermodel')

const getallUsers = async (req,res,next)=>{
    
    const keyword = req.query.search?{
        $or:[
            {name:{$regex: req.query.search,$options:'i'}},
            {email:{$regex: req.query.search,$options:'i'}}
        ]
    }:{}
    //{$and:[  , {_id:{$ne:req.user._id}}]}
   
    const data = await  User.find(keyword).find({_id:{$ne:req.user._id}})
    
    res.send(data)
}

module.exports = getallUsers