const model = {}
const database = require('../config/database')

model.getAccountBalance = (user_id) =>{
    return new Promise((resolve, reject) =>{
        database.query(`SELECT * FROM public.account_balance WHERE user_id = $1 `
        ,[user_id]).then((res)=>{
            resolve(res.rows)
        }).catch((error) =>{
            reject(error)
        })
    })
}

module.exports = model