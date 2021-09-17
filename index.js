const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

function primaryPrompt () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
        }
    ]).then(({ choice }) => {
        continuedPropmt(choice);
    }).catch(err => {
        if(err) throw err;
        return;
    })
};

function continuedPropmt(choice) {
    if (choice === 'View All Departments') {
        const sql = `SELECT * FROM department`
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    } else if (choice === 'View All Roles') {
        const sql = `SELECT * FROM role`
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    } else if (choice === 'View All Employees') {
        const sql = `SELECT * FROM employee`
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    }
    primaryPrompt();
}

primaryPrompt();