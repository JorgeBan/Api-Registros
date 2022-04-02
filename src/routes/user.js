const express = require('express');
const UserController = require('../controllers/UserController')

const router = express.Router()
router.post('/register', UserController.storeUser)


module.exports = router