const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

let departments = [];
let roles = [];
let employees = [];
function updateTables(){
    const departmentsTemp = [];
    const rolesTemp = [];
    const employeesTemp = [];
    db.query(`SELECT * FROM department`, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        for(let i = 0; i < rows.length; i++) {
            departmentsTemp.push(rows[i].name);
        }
        departments = departmentsTemp;
    });
    
    db.query(`SELECT * FROM role`, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        for(let i = 0; i < rows.length; i++) {
            rolesTemp.push(rows[i].title);
        }
        roles = rolesTemp;
    });
    
    db.query(`SELECT * FROM employee`, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        for(let i = 0; i < rows.length; i++) {
            employeesTemp.push(rows[i].first_name + ' ' + rows[i].last_name);
        }
        employees = employeesTemp;
        employees.push('No Manager');
    });
}

function primaryPrompt() {
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
    })
};

function continuedPropmt(choice) {
    let sql;
    let params = [];

    switch(choice) {
        case 'View All Departments':
            sql = `SELECT * FROM department`

            db.query(sql, (err, rows) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                primaryPrompt();
            });
            break;
        case 'View All Roles':
            sql = `SELECT role.id, role.title, department.name AS department FROM role
            LEFT JOIN department ON role.department_id = department.id`

            db.query(sql, (err, rows) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                primaryPrompt();
            });
            break;
        case 'View All Employees':
            sql = `SELECT base.id, base.first_name, base.last_name, role.title AS title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee base
            LEFT JOIN role ON base.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON base.manager_id = manager.id`

            db.query(sql, (err, rows) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                primaryPrompt();
            });
            break;
        case 'Add Department':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: 'What is the name of your department?'
                }
            ]).then(({ department }) => {
                sql = `INSERT INTO department (name) VALUE (?)`;
                params = [department];
                db.query(sql, params, (err, row) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Added ${department} to the department table.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if(err) throw err;
            })
            break;
        case 'Add Role':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the title of the role?'
                }, 
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?'
                }, {
                    type: 'list',
                    name: 'department',
                    message: 'What department is the role in?',
                    choices: departments
                }
            ]).then(({ title, salary, department }) => {
                let depId = departments.indexOf(department) + 1;
                sql = `INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)`;
                params = [title, salary, depId];
                db.query(sql, params, (err, row) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Added ${title} to the role table.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if(err) throw err;
            })
            break;
        case 'Add Employee':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the first name of the employee?'
                }, 
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the last name of the employee?'
                }, {
                    type: 'list',
                    name: 'role',
                    message: 'What is thier role?',
                    choices: roles
                }, {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is their manager?',
                    choices: employees
                }
            ]).then(({ first_name, last_name, role, manager }) => {
                let roleId = roles.indexOf(role) + 1;
                let managerId;
                if(manager === 'No Manager') {
                    managerId = null;
                } else {
                    managerId = employees.indexOf(manager) + 1;
                }
                sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)`;
                params = [first_name, last_name, roleId, managerId];
                db.query(sql, params, (err, row) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Added ${first_name} ${last_name} to the employee table.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if(err) throw err;
            })
            break;
        case 'Update Employee Role':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Who would you like to update?',
                    choices: employees
                }, {
                    type: 'list',
                    name: 'role',
                    message: 'What role do you want to give them?',
                    choices: roles
                }
            ]).then(({ employee, role }) => {
                let roleId = roles.indexOf(role) + 1;
                let employeeId = employees.indexOf(employee) + 1;
                sql =  `UPDATE employee SET role_id = ? WHERE id = ?`;
                params = [roleId, employeeId]
                db.query(sql, params, (err, row) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Updated ${employees}'s role to ${role}'.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if(err) throw err;
            })
            break;
    }
}

updateTables();
primaryPrompt();