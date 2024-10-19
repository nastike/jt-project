const express = require ('express');
const sqlite3 = require('sqlite3').verbose();  // SQLite driver
const app = express();
const port = 3000;

//middleware to parse JSON
app.use(express.json());


const db = new sqlite3.Database('./db/database.db',sqlite3.OPEN_READWRITE,  (err)=>{
    if(err){
        console.error('Could not connect to the database: ', err)
    }else{
        console.log('Connected to the SQLite database');
    }
});

// Creating tables

db.serialize(()=>{
    db.run(`
        CREATE TABLE IF NOT EXISTS todos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        `);
    db.run(`
        CREATE TABLE IF NOT EXISTS subtasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending', 
        todo_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
        )
        `)
})
app.get('/', (req,res)=>{
    res.send('Todo API');
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});

