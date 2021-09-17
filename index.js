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
        if(choice === 'View All Departments') {
            const sql = `SELECT * FROM department`
            db.query(sql, (err, rows) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
            });
            primaryPrompt();
        }
    }).catch(err => {
        if(err) throw err;
        return;
    })
};

primaryPrompt();