const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/auth')
const validateTokenReset = require('../middleware/validateTokenReset')

route.post('/', ctrl.login)
route.get('/forget_password', ctrl.forgetPassword)
route.get('/:token', ctrl.verifyUser)
route.post('/reset', validateTokenReset, ctrl.resetPassword)

module.exports = route