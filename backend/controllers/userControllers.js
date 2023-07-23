const User = require('../models/usermodel')


const registerUser = async (req,res)=>{
    const {name ,email,password,picture} = req.body
     if(!name || !email || !password){
        res.status(400)
        throw new Error('Please Enter all the fields')
     }

     const userExit = await User.findOne({email})
     

     if(userExit){
        return res.status(400).send('user already exist')
     }
    
     const user = new User(req.body)
     try {
        await user.save()
        const token = await user.generateToken(user._id)
        res.status(201).send({user,token})
     } catch (error) {
        res.status(400).send('failed to create user')
     }

}

const authUser = async(req,res)=>{
   const {email,password} = req.body

   const user = await User.findOne({email})

   if(user && (await user.matchPassword(password))){
      try {
         const token = await user.generateToken(user._id)
      
      res.status(201).send({user,token})
      } catch (error) {
         res.status(400).send('user not found')
      }
   }
   else{
      res.status(400).send('user not found')
   }
}

module.exports ={registerUser,authUser} 