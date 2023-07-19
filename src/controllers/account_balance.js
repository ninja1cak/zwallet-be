const ctrl = {}
const model = require('../models/account_balance')
const {respons} = require('../utils/respons')

ctrl.getAccountBalance = async (req,res) =>{
    try {
        const data = await model.getAccountBalance({user_id : req.id})
        return respons(res, 200, data)
    } catch (error) {
        return respons(res, 404, error.messsage)
    }
}

module.exports = ctrl