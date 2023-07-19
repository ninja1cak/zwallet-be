const bcrypt = require('bcrypt')
const {generateToken} = require('../utils/jwt')
const ctrl = {}
const jwt = require('jsonwebtoken')
const model = require('../models/user')
const {respons} = require('../utils/respons')

ctrl.login = async (req, res) =>{
    try {
        const {email, password} = req.body
        const data = await model.getDataByEmail({email})

        if(data[0].length<=0){
            return res.send({
                status: 400,
                message: 'email not registered'
            })
        }

        if(data[0].status== 'pending'){
            return res.send({
                status: 400,
                message: 'account not verified'
            })
        }
        

        const isPassword = await bcrypt.compare(password, data[0].password)
        
        if(isPassword){
            const token = generateToken(data[0].username, data[0].user_id)
            return res.send({
                status: 201,
                message: 'login success',
                token: token
            })
        }else{
            return respons(res, 401, 'Invalid password')
        }

    } catch (error) {
        return respons(res, 404, error.message)

    }
}

ctrl.verifyUser = async (req, res) =>{
    try {
        const {token} = req.params
        jwt.verify(token, process.env.KEY, (error, decode) =>{
            if(error){
                return res.send({status : 404, message: "verification fail"})
            }
            req.email = decode
        })
        const dataUser = await model.getDataByEmail({email: req.email})
        console.log('dataUser', token)

        const params = {
            email: req.email,
            status: 'active',
            user_id: dataUser[0].user_id
        }

        const data = await model.updateUserStatus(params)
        return respons(res, 200, "verify success")
    } catch (error) {
        return respons(res, 404, error.message)
    }
}

module.exports = ctrl