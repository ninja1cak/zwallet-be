const model = {}
const { resolve } = require('path')
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

model.getDataByEmail = ({email}) =>{
    return new Promise((resolve, reject) =>{
        database.query(`SELECT user_id, username, password, status FROM public.user WHERE email = $1 `
        ,[email]).then((res)=>{
            resolve(res.rows)
        }).catch((error) =>{
            reject(error)
        })
    })
}

model.getUser = (user_id) =>{
    return new Promise ((resolve, reject) =>{
        database.query(`
            SELECT
                first_name,
                last_name,
                email,
                phone_number
            FROM 
                public.user 
            WHERE
                user_id = $1
        `,[user_id]).then((res) =>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

model.getAllUser = () =>{
    return new Promise ((resolve, reject) =>{
        database.query(`
            SELECT
                first_name,
                last_name,
                phone_number
            FROM 
                public.user 
        `).then((res) =>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

model.updateUser = ({username, email, password, phone_number, first_name, last_name, photo_profile, pin, status, user_id}) =>{
    return new Promise ((resolve, reject) =>{
        console.log({username, email, password, phone_number, first_name, last_name, photo_profile, pin, status, user_id})
        database.query(`
        UPDATE public.user
        SET
          username = COALESCE(NULLIF($1, ''), username),      
          email = COALESCE(NULLIF($2, ''), email),
          password = COALESCE(NULLIF($3, ''), password),
          phone_number = COALESCE(NULLIF($4, '+62'), phone_number),
          first_name = COALESCE(NULLIF($5, ''), first_name),
          last_name = COALESCE(NULLIF($6, ''), last_name),
          photo_profile = COALESCE(NULLIF($7, ''), photo_profile),
          pin = COALESCE(NULLIF($8, ''), pin)
        WHERE user_id = $9
        `, [
            username, 
            email, 
            password, 
            phone_number, 
            first_name, 
            last_name, 
            photo_profile, 
            pin, 
            user_id
        ]).then((res) =>{
            resolve(res.rowCount)
        }).catch((err) =>{
            reject(err)
        })
    })
}

model.updateUserStatus = ({email, status}) =>{
    return new Promise ((resolve, reject) =>{
        console.log(email)
        database.query(`
        UPDATE public.user
        SET         
          status = $1
        WHERE email = $2
        `, [
            status,
            email
        ]).then((res) =>{
            resolve(res.rowCount)
        }).catch((err) =>{
            reject(err)
        })
    })
}

module.exports = model