const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(cors({
    origin: ['http://localhost:8100', 'http://localhost:8101', 'http://localhost:8102'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT,
            lastName TEXT,
            email TEXT,
            username TEXT,
            password TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table ' + err.message);
            }
        });
    }
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ users: rows });
    });
});

app.post('/login', (req, res) => {
    console.log("Solicitud de inicio de sesión recibida:", req.body);
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error en el servidor' });
        } else if (row) {
            console.log("Inicio de sesión exitoso:", row); 
            res.status(200).json({ message: 'Inicio de sesión exitoso', user: row });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor API corriendo en http://localhost:${port}`);
});
