const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/account_balance')
const auth = require('../middleware/authCheck')


route.get('/', auth.check, ctrl.getAccountBalance)
module.exports = route