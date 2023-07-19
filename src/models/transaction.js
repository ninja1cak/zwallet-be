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

module.exports = model