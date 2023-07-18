const express = require('express')
const route = express.Router()

const user = require('../routers/user')

route.use('/user', user)

module.exports = route