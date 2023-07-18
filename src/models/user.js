const model = {}
const database = require('../config/database')


model.addUser = ({	
    username,
	email,
	password,
	pin}) =>{
    return new Promise((resolve, reject) =>{
        database.query(`
            insert into public.user(
                username,
                email,
                password,
                pin,
                status,
                updated_at	
            ) VALUES(
                $1,
                $2,
                $3,
                $4,
                'pending',
                'now()'
            )`,[username,email,password,pin]
            ).then((res) =>{
                res = 'create user success'
                resolve(res)
            }).catch((err) =>{
                console.log(reject)
                reject(err)
            })
    })
}

module.exports = model