const bcrypt = require('bcrypt')
const {generateToken} = require('../utils/jwt')
const ctrl = {}
const jwt = require('jsonwebtoken')
const model = require('../models/user')
const {respons} = require('../utils/respons')
const sendMail = require('../utils/mailer')
const { verify } = require('crypto')
const { error } = require('console')
const hash = require('../utils/hash')

ctrl.login = async (req, res) =>{
    try {
        const {email, password} = req.body
        const data = await model.getDataByEmail({email})

        if(data.length<=0){
            console.log('tessss')
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
            return res.send({status: 401, message: 'Invalid password'})
        }

    } catch (error) {
        return respons(res, 401, error.message)

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
        return respons(res, 200, {message:"verify success", email: req.email})
    } catch (error) {
        return respons(res, 401, error.message)
    }
}

ctrl.forgetPassword = async (req, res) =>{
    try {
        const {email} = req.query
        console.log(email)
        const data = await model.getDataByEmail({email})
        console.log(data.length)
        if(data.length == 0){
            return res.send({status: 400, message: 'Email not register'})
        }
        const token = jwt.sign(email, process.env.KEY)        
        await sendMail(email, token, 'forget_password')
        return respons(res, 200, 'Check your email')
    } catch (error) {
        return respons(res, 401, error.message)
    }
}

ctrl.resetPassword = async (req, res) =>{
    try {
        const {password} = req.body
        console.log(password)
        if(password == '' && password== undefined){
            return res.send('')
        }
        const passwordHash = await hash(password)
        console.log(req.email ,passwordHash)
        const data = await model.updateUser({password: passwordHash, email: req.email})
        return respons(res, 200, "change password success")
    } catch (error) {
        
    }
}

module.exports = ctrl