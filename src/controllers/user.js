const ctrl = {}
const model = require('../models/user')
const {respons} = require('../utils/respons')
const hash = require('../utils/hash')
const sendMail = require('../utils/mailer')
const jwt = require('jsonwebtoken')

ctrl.insertUser = async (req, res) =>{
    try {
        const {username, email, password, pin} = req.body
        console.log({username, email, password, pin})
        
        const hashPassword = await hash(password)
        const activationCode = jwt.sign(email, process.env.KEY)
        sendMail(email, activationCode)

        const result = await model.addUser({username, email, password: hashPassword, pin})
        return respons(res, 201, result)
    } catch (error) {
        console.log(error)
        return respons(res, 500, error)
    }
}

ctrl.showUser = async (req, res) =>{
    try {
        const data = await model.getUser(req.id);
        return respons(res, 200, data)
    } catch (error) {
        return respons(res, 404, error)
    }
}

ctrl.showAllUser = async (req, res) =>{
    try {
        const data = await model.getAllUser();
        return respons(res, 200, data)
    } catch (error) {
        return respons(res, 404, error)
    }
}

module.exports = ctrl