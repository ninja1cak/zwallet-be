const ctrl = require('../controllers/user')
const express = require('express')
const route = express.Router()
const auth = require('../middleware/authCheck')
const validateUserEmail = require('../middleware/validateUserEmail')
const upload = require('../middleware/upload')

route.post('/', validateUserEmail ,ctrl.insertUser)
route.put('/', ctrl.insertPin)
route.get('/', auth.check, ctrl.showUser)
route.get('/all', auth.check, ctrl.showAllUser)
route.patch('/', auth.check, upload.single('image'), ctrl.updateImageUser)
route.patch('/update', auth.check, ctrl.changeDataUser)

module.exports = route