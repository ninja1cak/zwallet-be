const ctrl = {}
const model = require('../models/user')
const {respons} = require('../utils/respons')
const hash = require('../utils/hash')
const sendMail = require('../utils/mailer')
const jwt = require('jsonwebtoken')
const upload = require('../utils/upload')
const bcrypt = require('bcrypt')
ctrl.insertUser = async (req, res) =>{
    try {
        const {first_name, last_name, email, password} = req.body
        
        const hashPassword = await hash(password)
        const activationCode = jwt.sign(email, process.env.KEY)
        await sendMail(email, activationCode, 'activate')

        const result = await model.addUser({first_name, last_name, email, password: hashPassword})
        return respons(res, 201, result)
    } catch (error) {
        console.log(error)
        return respons(res, 500, error)
    }
}

ctrl.insertPin = async (req,res) =>{
    try {
        const {pin} = req.body
        const {email} = req.query
        const result = await model.updatePin({pin, email})
        return respons(res, 201, result)
    } catch (error) {
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
        const {page, limit, search, id} = req.query
        console.log('tes')
        if(search ===undefined || search === ''){
            req.query.search = ''
          }else{
            req.query.search =`%${search}%`
          }
      
        const params = {
        ...req.query,
        user_id : id || '',
        page : page || 1,
        limit : limit || 4,
        login_id: req.id
        }

        console.log('tes1')


        const data = await model.getAllUser(params);
        return respons(res, 200, data)
    } catch (error) {
        return respons(res, 404, error)
    }
}

ctrl.updateImageUser = async (req, res) =>{
    try {
        let url_photo = ''

        console.log(req.file)
        if(req.file != undefined){
            url_photo = await upload(req.file.path) 
        }else{
            return respons(res, 400, 'png, jpg, jpeg only')
        }

        const data = model.updateUser({photo_profile: url_photo, user_id : req.id})
        return respons(res, 200, "Update success")
    } catch (error) {
        return respons(res, 400, error.message)

    }
}

ctrl.changeDataUser = async (req, res) =>{
    try {

        let {oldPassword,password, phone_number, pin, email} = req.body
        let passwordFromDB
        if(email){
            passwordFromDB = await model.getDataByEmail({email})
        }

        if(password && oldPassword) {
            console.log(oldPassword, passwordFromDB[0].password)

            console.log(password, oldPassword)

            const isPassword = await bcrypt.compare(oldPassword, passwordFromDB[0].password)
            console.log(isPassword, passwordFromDB[0].password)
            if(isPassword){
                password = await hash(password)
            }else{
                return res.send({status: 404, message: "Password is wrong"})
            }
        }
        console.log(req.file)

        const data = model.updateUser({password, phone_number,  pin, user_id : req.id})
        return respons(res, 200, "Update success")
    } catch (error) {
        return respons(res, 400, error.message)

    }
}

module.exports = ctrl