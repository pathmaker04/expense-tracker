import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database/db.js';
import dashboardRouter  from './routes/dashboard.route.js';
import historyRouter  from './routes/history.route.js';
import session from 'express-session';
import type { RowDataPacket } from 'mysql2/promise';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: 'https://expense-tracker-git-main-pathmaker04s-projects.vercel.app',
  credentials: true
}));

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true,      
    httpOnly: true,
    sameSite: 'none'
   }
}));

app.use(express.static(path.join(__dirname, '../../frontend')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

////////////////////////////////////

app.get('/', (req, res) => {
  res.redirect('https://expense-tracker-git-main-pathmaker04s-projects.vercel.app/pages/login.html');
});

app.get('/index', (req, res) => {
  const index = path.join(__dirname, '../../frontend/index.html');
  res.sendFile(index);
  res.redirect('https://expense-tracker-git-main-pathmaker04s-projects.vercel.app/pages/login.html');
});

app.get('/login', (req, res) => {
  const login = path.join(__dirname, '../../frontend/pages/login.html');
  res.sendFile(login);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE email=?',
    [email]
  );

  if (rows.length > 0) {
    
    const user = rows[0];

    if (user!.password === password) {
      (req.session as { userId?: number }).userId = user!.id;
      req.session.save(() => {
        res.redirect('https://expense-tracker-git-main-pathmaker04s-projects.vercel.app/pages/dashboard.html');
      });
      
      //return res.redirect('/dashboard');
    } else {
      return res.send('Wrong password');
    }
  } else {
    
    const [result]: any = await db.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    );

    req.session.userId = result.insertId;
    return res.redirect('https://expense-tracker-git-main-pathmaker04s-projects.vercel.app/pages/dashboard.html');
  }
});

app.get('/api/summary', async (req, res) => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT SUM(CASE WHEN type=\'income\' THEN amount ELSE 0 END) AS totalIncome, SUM(CASE WHEN type=\'expense\' THEN amount ELSE 0 END) AS totalExpense FROM expenses'
  );

  const totalIncome = rows[0]!.totalIncome || 0;
  const totalExpense = rows[0]!.totalExpense || 0;
  const totalBalance = totalIncome - totalExpense;

  res.json({
    totalIncome,
    totalExpense,
    totalBalance
  });
});

////////////////////////////////////
  
app.get('/dashboard', async (req, res) => {
  const dashboard = path.join(__dirname, '../../frontend/pages/dashboard.html');
  res.sendFile(dashboard);

});
app.use('/api/dashboard', dashboardRouter)

////////////////////////////////////

app.get('/add', (req, res) => {
  const add = path.join(__dirname, '../../frontend/pages/add.html');
  res.sendFile(add);
});

app.post('/add', async (req, res) => {
  try {
    const user_id = req.session.userId;

    if (!user_id) {
      return res.status(401).send('Not logged in');
    }

    const { type, amount, category_id, date, note } = req.body;

    await db.execute(
      `INSERT INTO expenses (user_id, category_id, type, amount, date, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, category_id, type, amount, date, note]
    );

    res.redirect('https://expense-tracker-git-main-pathmaker04s-projects.vercel.app/pages/dashboard.html');

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



////////////////////////////////////

app.get('/history', (req, res) => {
  const history = path.join(__dirname, '../../frontend/pages/history.html');
  res.sendFile(history);
});

app.use('/api/history', historyRouter)

app.delete('/api/history/:id', async (req, res) => {
  const { id } = req.params;

  await db.query('DELETE FROM expenses WHERE id = ?', [id]);

  res.json({ success: true });
});

////////////////////////////////////

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('https://expense-tracker-git-main-pathmaker04s-projects.vercel.app/pages/login.html');
  });
});

////////////////////////////////////

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

console.log('Starting server...');


