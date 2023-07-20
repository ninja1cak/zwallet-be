const jwt = require('jsonwebtoken')

const validate = async (req, res, next) =>{
  try {
    const {token} = req.body
    jwt.verify(token, process.env.KEY, (error, decode) =>{
        if(error){
            return res.send({status: 400, message:'invalid token'})
        }
        req.email = decode
        return next()

    })

    
  } catch (error) {
   return res.send(error)
  }

}

module.exports = validate