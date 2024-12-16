const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'your_secret_key'; 

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gymbro_db',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing!' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking for existing user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error registering user:', err);
                    return res.status(500).json({ error: 'Failed to register user' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error during login:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
            res.json({
                message: 'Login successful',
                token,
                username: user.username,
                email: user.email, // Include email in the response
            });
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});


app.post('/plans', authenticateToken, (req, res) => {
    const { name, validity, amount, available } = req.body;

    if (!name || !validity || !amount || !available) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const query = 'INSERT INTO plans (name, validity, amount, available) VALUES (?, ?, ?, ?)';
    db.query(query, [name, validity, amount, available], (err, result) => {
        if (err) {
            console.error('Error adding plan:', err);
            return res.status(500).json({ error: 'Failed to add plan' });
        }
        res.status(201).json({ message: 'Plan added successfully' });
    });
});

app.get('/plans', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM plans';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching plans:', err);
            return res.status(500).json({ error: 'Failed to fetch plans' });
        }
        res.json(results);
    });
});

app.post('/members', authenticateToken, (req, res) => {
    const { name, join_date, email, phone, plan, price } = req.body;

    if (!name || !join_date || !email || !phone || !plan || !price) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const checkPlanQuery = 'SELECT available FROM plans WHERE name = ?';
    db.query(checkPlanQuery, [plan], (err, results) => {
        if (err) {
            console.error('Error checsking plan availability:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0 || results[0].available <= 0) {
            return res.status(400).json({ error: 'Plan not available' });
        }

        const addMemberQuery = 'INSERT INTO members (name, join_date, email, phone, plan, price) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(addMemberQuery, [name, join_date, email, phone, plan, price], (err, result) => {
            if (err) {
                console.error('Error adding member:', err);
                return res.status(500).json({ error: 'Failed to add member' });
            }

            const updatePlanQuery = 'UPDATE plans SET available = available - 1 WHERE name = ?';
            db.query(updatePlanQuery, [plan], (err) => {
                if (err) {
                    console.error('Error updating plan availability:', err);
                    return res.status(500).json({ error: 'Failed to update plan availability' });
                }

                res.status(201).json({ message: 'Member added successfully' });
            });
        });
    });
});

app.get('/members', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM members';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching members:', err);
            return res.status(500).json({ error: 'Failed to fetch members' });
        }
        res.json(results);
    });
});

app.put('/update-profile', authenticateToken, (req, res) => {
    const { username, contactNo, email } = req.body;
    const userId = req.user.userId;

    const query = 'UPDATE users SET username = ?, contact_no = ?, email = ? WHERE id = ?';
    db.query(query, [username, contactNo, email, userId], (err) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
        res.json({ message: 'Profile updated successfully' });
    });
});

app.put('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const query = 'SELECT password FROM users WHERE id = ?';
    db.query(query, [userId], async (err, results) => {
        if (err) {
            console.error('Error fetching user password:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, results[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(updateQuery, [hashedPassword, userId], (err) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ error: 'Failed to change password' });
            }
            res.json({ message: 'Password changed successfully' });
        });
    });
});


app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.email}` });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
