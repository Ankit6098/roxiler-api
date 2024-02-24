const mysql = require('mysql2');
const axios = require('axios');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root'
});

db.connect((err) => {
    if (err) {
        console.log('Error in connecting to MySQL', err);
    }
    console.log('Connected to MySQL');

    // Create a database if it doesn't exist
    db.query('CREATE DATABASE IF NOT EXISTS node_mysql', (err, result) => {
        if (err) {
            console.log('Error in creating database', err);
        }
        console.log('Database created');
    });

    // Use the database
    db.query('USE node_mysql', (err, result) => {
        if (err) {
            console.log('Error in using database', err);
        }
        console.log('Using database');
    });

    // Create a table if it doesn't exist   
    // Initialize database schema and seed data
    const initializeDatabase = async () => {
        try {
        const connection = await db.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            productTitle VARCHAR(255),
            price DECIMAL(10, 2),
            description TEXT,
            category VARCHAR(255),
            image VARCHAR(255),
            sold BOOLEAN,
            dateOfSale DATE
            )
        `);
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const jsonData = response.data;
        await connection.query('DELETE FROM transactions');
        await connection.query('INSERT INTO transactions (dateOfSale, productTitle, description, price, category, sold, image) VALUES ?', [jsonData.map(item => [item.dateOfSale, item.productTitle, item.description, item.price, item.category, item.sold, item.image])]);
        console.log('Database initialized successfully');
        connection.release();
        } catch (error) {
        console.error('Error initializing database:', error.message);
        }
    };
});
