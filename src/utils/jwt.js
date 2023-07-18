const jwt = require('jsonwebtoken')
require('dotenv/config')

module.exports = {
    generateToken: (username, user_id) => {
        const payload = {
            username : username,
            id: user_id
        }
        const token = jwt.sign(payload, process.env.KEY, {expiresIn:'5h'})
        return token
    }
}