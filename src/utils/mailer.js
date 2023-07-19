const nodemailer = require('nodemailer')
require('dotenv/config')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
})


const configSendMail = (email, confirmationCode, condition) =>{
    let mailOptions = {}

    if(condition == 'activate'){
        mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Activation Account",
            text: `Open this link for account verfivication : localhost:8888/auth/${confirmationCode}`
        }    
    }

    if(condition == 'forget_password'){
        mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Change Password",
            text: `Open this link for change password : localhost:8888/auth/forget_password?code=${confirmationCode}}`
        }    
    }

    console.log(mailOptions)

    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            console.log(error)
        }else{
            console.log('email sent', info.response)
        }
    })
}

module.exports = configSendMail