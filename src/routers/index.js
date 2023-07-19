const express = require('express')
const route = express.Router()

const user = require('../routers/user')
const auth = require('../routers/auth')
const transaction = require('../routers/transaction')
const account_balance = require('../routers/account_balance')

route.use('/user', user)
route.use('/auth', auth)
route.use('/transaction', transaction)
route.use('/account_balance', account_balance)



module.exports = route