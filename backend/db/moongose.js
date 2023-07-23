const mongoose = require("mongoose");
const connect = async () => {
    try { 
        await mongoose.connect('mongodb+srv://19bd1a0501:passwordcse@cluster0.aapeu.mongodb.net/test')
        console.log("database connected")
    } catch (error) {
        console.log("connection failed")
        process.exit();
    }
  
};

module.exports = connect