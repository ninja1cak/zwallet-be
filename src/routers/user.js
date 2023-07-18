const ctrl = require('../controllers/user')
const express = require('express')
const route = express.Router()
const auth = require('../middleware/authCheck')

route.post('/', ctrl.insertUser)
route.get('/', auth.check, ctrl.showUser)
route.get('/all', auth.check, ctrl.showAllUser)


module.exports = route