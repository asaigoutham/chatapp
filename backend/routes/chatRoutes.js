const express = require('express')
const { auth } = require('../middleware/auth')
const {accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup} = require('../controllers/chatscontrollers')
const router = express.Router()


router.post('/',auth,accessChat)
router.get('/',auth,fetchChats)
router.post('/group',auth,createGroupChat)
router.put('/rename',auth,renameGroup)
router.put('/groupremove',auth,removeFromGroup)
router.put('/groupadd',auth,addToGroup) 


module.exports = router