const express = require("express")
const {sendMessage,allMessages} = require("../controllers/messageControllers")
const {auth} = require('../middleware/auth')


const router = express.Router()


router.post("/",auth,sendMessage)
 
router.get("/:chatId",auth,allMessages) 

module.exports = router