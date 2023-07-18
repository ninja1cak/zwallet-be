const jwt = require('jsonwebtoken')
require('dotenv/config')
const authCheck = {}

authCheck.check = (req, res, next) =>{
    const {authorization} = req.headers
    if(!authorization){
        return res.send('silahkan login')
    }

    const token = authorization.replace("Bearer ", '')

    jwt.verify(token, process.env.KEY, (err, decode) =>{
        if(err){
            return res.send('auth error')
        }
        req.email = decode.email
        req.id = decode.id
        return next()
    })
}

module.exports = authCheck