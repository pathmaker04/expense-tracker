import { db } from '../database/db.js';
import type { RowDataPacket } from 'mysql2/promise';
import type { Request, Response } from 'express';

export const getDashboard = async (req: Request, res: Response) => {

  try {
    const user_id = req.session.userId;

    console.log('DashboardUser:',user_id);

    const [rows] = await db.query<RowDataPacket[]>(
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

    const totalBalance = totalIncome - totalExpense;

    let savingsRate = 0;

    if (totalIncome > 0) {
        savingsRate = Number(((totalBalance / totalIncome) * 100).toFixed(1));
    }

    ////////////////////////////////////

    const currentMonth = new Date().getMonth();

    let monthlyIncome = 0;
    let monthlyExpense = 0;

    rows.forEach(item => {
        const itemMonth = new Date(item.date).getMonth();

        if (itemMonth === currentMonth) {
        if (item.type === 'income') {
            monthlyIncome += Number(item.amount);
        } else {
            monthlyExpense += Number(item.amount);
        }
        }
    });

    ////////////////////////////////////

    const query = `
        SELECT 
            DATE_FORMAT(date, '%Y-%m') AS month,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
        FROM expenses
        WHERE user_id = ?
        GROUP BY month
        ORDER BY month;
        `;
    const [monthlyRows] = await db.query(query, [user_id]);

    let monthly = monthlyRows;

    ////////////////////////////////////

    const queryCategory = `
        SELECT 
            c.name AS category,
            SUM(e.amount) AS total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
        AND e.type = 'expense'
        GROUP BY c.name
        ORDER BY total DESC;
        `;

    const [categoryRows] = await db.query(queryCategory, [user_id]);

    let categories = categoryRows;  

    res.json({  
        totalIncome,
        totalExpense,
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        savingsRate,
        monthly,   
        categories
    });

  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};  

  




