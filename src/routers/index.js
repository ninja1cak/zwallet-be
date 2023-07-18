const express = require('express')
const route = express.Router()

const user = require('../routers/user')
const auth = require('../routers/auth')

route.use('/user', user)
route.use('/auth', auth)
module.exports = route