const model = {}
const { resolve } = require('path')
const database = require('../config/database')
const escape = require('pg-format')

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
                phone_number,
                pin,
                photo_profile,
                balance,
                expense,
                income
            FROM 
                public.user u 
            JOIN
                public.account_balance ab
            ON
                u.user_id = ab.user_id
            
            WHERE
                u.user_id = $1
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
                phone_number,
                username,
                email
            FROM 
                public.user 
        `).then((res) =>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

model.updateUser = ({email, password, phone_number, first_name, last_name, photo_profile, pin,  user_id}) =>{
    return new Promise ((resolve, reject) =>{
        console.log({email, password, phone_number, first_name, last_name, photo_profile, pin,  user_id})
        
        let searchByUserId = ''
        let searchByEmail = ''
        if(user_id){
            searchByUserId += escape(`AND user_id = %s`, user_id)
        }else{
            searchByEmail += escape(`AND email = %L`, email)
        }
        
        database.query(`
        UPDATE public.user
        SET
          email = COALESCE(NULLIF($1, ''), email),
          password = COALESCE(NULLIF($2, ''), password),
          phone_number = COALESCE(NULLIF($3, '+62'), phone_number),
          first_name = COALESCE(NULLIF($4, ''), first_name),
          last_name = COALESCE(NULLIF($5, ''), last_name),
          photo_profile = COALESCE(NULLIF($6, ''), photo_profile),
          pin = COALESCE(NULLIF($7, ''), pin)
        WHERE true ${searchByUserId} ${searchByEmail}
        `, [
            email, 
            password, 
            phone_number, 
            first_name, 
            last_name, 
            photo_profile, 
            pin
        ]).then((res) =>{
            resolve(res.rowCount)
        }).catch((err) =>{
            reject(err)
        })
    })
}


model.updateUserStatus = async ({email, status,user_id}) =>{
    const db = await database.connect()
    try {
        await db.query('BEGIN')
        
        const updateStatus =  await db.query(`
            UPDATE public.user
            SET         
                status = $1
            WHERE email = $2
        `, [status, email])

        await db.query(` 
            INSERT INTO public.account_balance(
                user_id,
                balance,
                income,
                expense
            ) VALUES (
                $1,
                0,
                0,
                0
            )`,[user_id])

        await db.query('COMMIT')
        return updateStatus.rowCount
    } catch (error) {
        await db.query('ROLLBACK')
        return error

    }
}

model.readByUser = (username, email) =>{
    return new Promise ((resolve, reject) => {
      database.query(`SELECT * FROM public.user WHERE username = $1 OR email = $2`, [username, email])
      .then((res) => {
        resolve(res.rows)
      })
      .catch((error) =>{
  
        error = "Failed"
        reject(error)
      })
  
    })
  }
module.exports = model