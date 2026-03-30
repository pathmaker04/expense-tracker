import { db } from '../database/db.js';
import type { RowDataPacket } from 'mysql2/promise';
import type { Request, Response } from 'express';



export const getHistory = async (req: Request, res: Response) => {

    try {

        const user_id = req.session.userId;

        let [rows] = await db.query<RowDataPacket[]>(
            `SELECT type, amount, category_id, date 
            FROM expenses 
            WHERE user_id = ?`,
            [user_id]
        );

        ////////////////////////////////////

        let totalIncome = 0;
        let totalExpense = 0;

        rows.forEach(item => {
            if (item.type === 'income') totalIncome += Number(item.amount);
            else totalExpense += Number(item.amount);
        });

        ////////////////////////////////////

        const { type } = req.query;

        let sql = `
            SELECT 
                e.id,
                e.type,
                e.amount,
                e.date,
                e.note,
                c.name AS category_name
            FROM expenses e
            LEFT JOIN categories c 
                ON e.category_id = c.id
            WHERE e.user_id = ?
        `;

        const params: any[] = [user_id];

        if (type && type !== 'all') {
            sql += ' AND type = ?';
            params.push(type);
        }

        sql += ' ORDER BY date DESC';

        [rows] = await db.query<RowDataPacket[]>(sql, params);
        res.json({
            rows,
            totalIncome,
            totalExpense,
        }
        );

    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }

}