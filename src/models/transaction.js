const model = {}
const database = require('../config/database')

model.transactionMoney = async ({sender_id, receiver_id, amount, note}) =>{
    const db = await database.connect()
    try {
        console.log({sender_id, receiver_id, amount, note})
        await db.query('BEGIN')
        const data = await db.query(`
        INSERT INTO public.transaction_log(
            sender_id,
            receiver_id,
            amount,
            note,
            transfer_date
        ) VALUES(
            $1,
            $2,
            $3,
            $4,
            now()
        ) `, [sender_id, receiver_id, amount, note])        
        
        await db.query(`
        UPDATE public.account_balance
        SET 
            balance = balance + $1,
            income = income + $1,
            updated_at = now()
        WHERE
            user_id = $2
        `, [amount, receiver_id])
        
        await db.query(`
        UPDATE public.account_balance
        SET 
            balance = balance - $1,
            expense = expense + $1,
            updated_at = now()
        WHERE
            user_id = $2
        `, [amount, sender_id])
        
        await db.query('COMMIT')
        return 'Transaction Success'
    } catch (error) {
        
        await db.query('ROLLBACK')
        return error
    }
}

model.readTransactionLogById = (user_id) =>{
    return new Promise((resolve, reject) =>{
        
        console.log(user_id)
        database.query(`

        SELECT 
            sender_id, 
            receiver_id, 
            amount, 
            first_name, 
            last_name, 
            user_id, 
            transfer_date
        FROM 
            public.transaction_log  
        JOIN
             public.user 
        ON 
            (sender_id = user_id and user_id != $1 ) 
        OR
            (receiver_id = user_id and user_id != $1 ) order by transfer_date desc
        LIMIT 4
        
        `,[user_id]
        ).then((res) =>{
            resolve(res.rows)
        }).catch((err) =>{
            reject(err)
        })
    })
}

module.exports = model