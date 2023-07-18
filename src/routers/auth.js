const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/auth')


route.get('/', ctrl.login)

module.exports = route