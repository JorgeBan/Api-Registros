const express = require('express');
const UserController = require('../controllers/UserController')

const router = express.Router()
router.post('/register', UserController.storeUser)
router.post('/login', UserController.login)

router.get('/confirm/:token', UserController.confirmUser)


module.exports = router