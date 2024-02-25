const express = require('express');
const app = express();
const port = 8000;

const db = require('./config/db');

app.get('/', (req, res) => {
    res.send('Welcome to the Node.js and MySQL app!');
    }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log('Error in running the server', err);
    }
    console.log('Server is running on port', port);
});
