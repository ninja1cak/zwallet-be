const ctrl = {}
const model = require('../models/transaction')
const modelAccBalance = require('../models/account_balance')
const {respons} = require('../utils/respons')

ctrl.transactionMoney = async (req, res) =>{ 
    try {
        const {amount, note, transfer_date} = req.body
        const {receiver_id} = req.query
        
        const account_balance = await modelAccBalance.getAccountBalance(req.id)

        if(account_balance[0].balance < amount){
            return respons(res, 400, 'Account balance not enough')
        }
        console.log('sebelum transaction money')
        const data = await model.transactionMoney({sender_id: req.id, receiver_id, amount, note: note || '', transfer_date})
        console.log(account_balance)
        return respons(res, 201, data)

    } catch (error) {
        return respons(res, 404, error.message)
    }
}

ctrl.getTransactionLogById = async (req, res) =>{
    try {
        const {limit, page} = req.query

        const data = await model.readTransactionLogById(req.id, {limit: limit || 4, page: page || 1})
        
        return respons(res, 200, data)
        
    } catch (error) {
        
        return respons(res, 400, error.message)
        
    }
} 

module.exports = ctrl