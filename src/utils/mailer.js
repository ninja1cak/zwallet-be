const nodemailer = require('nodemailer')
require('dotenv/config')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
})


const configSendMail = async (email, confirmationCode, condition) =>{
    let mailOptions = {}

    if(condition == 'activate'){
        mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Activation Account",
            text: `Open this link for account verfivication : https://zwallet-fe-five.vercel.app///create-pin/${confirmationCode}`
        }    
    }
    if(condition == 'forget_password'){
        mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Change Password",
            text: `Open this link for change password : https://zwallet-fe-five.vercel.app///reset/${confirmationCode}`
        }    
    }

    console.log(mailOptions)
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) =>{
            if(error){
                console.log(error)
                reject(err)
            }else{
                console.log('email sent', info.response)
                resolve(info)
            }
        })
    })

}

module.exports = configSendMail