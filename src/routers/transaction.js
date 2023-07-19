const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/transaction')
const auth = require('../middleware/authCheck')


route.post('/', auth.check, ctrl.transactionMoney)
module.exports = route