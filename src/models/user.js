const model = {}
const database = require('../config/database')
const escape = require('pg-format')

model.addUser = ({	
    first_name,
    last_name,
	email,
	password,
	pin}) =>{
    return new Promise((resolve, reject) =>{
        const username = `${first_name} ${last_name}`
        database.query(`
            insert into public.user(
                first_name,
                email,
                password,
                pin,
                last_name,
                username,
                status,
                updated_at	
            ) VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                'pending',
                'now()'
            )`,[first_name, email, password, pin, last_name, username]
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

model.getAllUser = async ({page, limit, search}) =>{
    try {
        const offset =  (page-1) * limit
        let searchQuery = ''

        if(search){
            searchQuery = escape(`AND concat(first_name, ' ', last_name) ILIKE %L`, search)
        }

        const totalData = await database.query(`
            SELECT COUNT(user_id) count from public.user
        `)
        const count = totalData.rows[0].count
        const meta = {
          next : count == 0 ? null : page == Math.ceil(count/limit) ? null : Number(page) + 1,
          prev : page == 1 ? null : Number(page) - 1,
          total: count
        }
        const data = await database.query(`
            SELECT
                first_name,
                last_name,
                phone_number,
                username,
                email
            FROM 
                public.user 
            WHERE true  ${searchQuery}
            LIMIT $1
            OFFSET $2
        `,[limit, offset])

        return {data: data.rows, meta:meta}
    } catch (error) {
        return error
    }
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

model.readByUser = (email) =>{
    return new Promise ((resolve, reject) => {
      database.query(`SELECT * FROM public.user WHERE email = $1`, [email])
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