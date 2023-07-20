const model = require('../models/user')

const validate = async (req, res, next) =>{
  try {
    const {username, email} = req.body
    const result = await model.readByUser(email)
    if(result == ''){
      return next()
    }
    
    if(email == result[0].email){
      return res.send({status: 400, message: 'email has been registered'})
    }


  } catch (error) {
   return res.send(error)
  }

}

module.exports = validate