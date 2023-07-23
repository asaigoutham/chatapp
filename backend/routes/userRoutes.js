const express = require('express')
const {registerUser,authUser} = require('../controllers/userControllers')
const getallUsers = require('../controllers/getallUsers')
const {auth} = require('../middleware/auth')
const router = express.Router()

router.post('/',registerUser)
router.post('/login',authUser)
router.get('/',auth,getallUsers)

module.exports = router