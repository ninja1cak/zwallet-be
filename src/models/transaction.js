const model = {}
const database = require('../config/database')

model.transactionMoney = async ({sender_id, receiver_id, amount, note, transfer_date}) =>{
    const db = await database.connect()
    try {
        console.log({receiver_id, amount, note, transfer_date})

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
            $5
        ) `, [sender_id, receiver_id, amount, note, transfer_date])        
        console.log('tes')

        await db.query(`
        UPDATE public.account_balance
        SET 
            balance = balance + $1,
            income = income + $1,
            updated_at = $3
        WHERE
            user_id = $2
        `, [amount, receiver_id, transfer_date])
        console.log('tes 1')

        await db.query(`
        UPDATE public.account_balance
        SET 
            balance = balance - $1,
            expense = expense + $1,
            updated_at = $3
        WHERE
            user_id = $2
        `, [amount, sender_id, transfer_date])
        
        await db.query('COMMIT')
        return 'Transaction Success'
    } catch (error) {
        console.log(error)
        await db.query('ROLLBACK')
        return error
    }
}

model.readTransactionLogById = async (user_id, {page, limit}) =>{
    try {
        const offset =  (page-1) * limit

        const totalData = await database.query(`

        SELECT COUNT (tlog.user_id)
        FROM 
            (
                SELECT 
                    sender_id, 
                    receiver_id, 
                    amount, 
                    user_id, 
                    transfer_date
                FROM 
                    public.transaction_log  
                JOIN
                    public.user 
                ON 
                    (sender_id = user_id and user_id = $1 ) 
                OR
                    (receiver_id = user_id and user_id = $1 ) 
            ) tlog
        JOIN 
            public.user u 
        ON 
            (sender_id = u.user_id and u.user_id != $1)
        OR
            (receiver_id = u.user_id and u.user_id != $1) 
        `,[user_id]
        )
        const count = totalData.rows[0].count
        console.log(count)
        const meta = {
            next : count == 0 ? null : page == Math.ceil(count/limit) ? null : Number(page) + 1,
            prev : page == 1 ? null : Number(page) - 1,
            total: count
          }
        const data = await database.query(`

        SELECT 
            sender_id, 
            receiver_id, 
            amount, 
            first_name, 
            last_name, 
            tlog.user_id, 
            transfer_date
        FROM 
            (
                SELECT 
                    sender_id, 
                    receiver_id, 
                    amount, 
                    user_id, 
                    transfer_date
                FROM 
                    public.transaction_log  
                JOIN
                    public.user 
                ON 
                    (sender_id = user_id and user_id = $1 ) 
                OR
                    (receiver_id = user_id and user_id = $1 ) 
            ) tlog
        JOIN 
            public.user u 
        ON 
            (sender_id = u.user_id and u.user_id != $1)
        OR
            (receiver_id = u.user_id and u.user_id != $1) 
        ORDER BY transfer_date desc LIMIT $2 OFFSET ${offset}
        `,[user_id, limit]
        )
        return {data: data.rows, meta: meta}
    } catch (error) {
        return error
    }    
}

module.exports = model