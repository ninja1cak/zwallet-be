const ctrl = require('../controllers/user')
const express = require('express')
const route = express.Router()
const auth = require('../middleware/authCheck')
const validateUserEmail = require('../middleware/validateUserEmail')

route.post('/', validateUserEmail ,ctrl.insertUser)
route.put('/', validateUserEmail ,ctrl.insertPin)
route.get('/', auth.check, ctrl.showUser)
route.get('/all', auth.check, ctrl.showAllUser)
route.patch('/', auth.check, ctrl.changeDataUser)
module.exports = route