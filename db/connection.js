const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '1luvBilb0',
        database: 'employee_tracker_db'
    }
);

module.exports = db;