const model = require('../models/user')
const {respons} = require('../utils/respons')
const validate = async (req, res, next) =>{
  try {
    const {username, email} = req.body
    const result = await model.readByUser(email)
    if(result == ''){
      return next()
    }
    
    if(email == result[0].email){
      return respons(res, 400, 'EMAIL HAS BEEN REGISTERED')
    }


  } catch (error) {
   return res.send(error)
  }

}

module.exports = validate