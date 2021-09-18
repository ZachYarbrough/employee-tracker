const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

let departments = [];
let roles = [];
let employees = [];
function updateTables() {
    const departmentsTemp = [];
    const rolesTemp = [];
    const employeesTemp = [];
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            departmentsTemp.push(rows[i].name);
        }
        departments = departmentsTemp;
    });

    db.query(`SELECT * FROM role`, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            rolesTemp.push(rows[i].title);
        }
        roles = rolesTemp;
    });

    db.query(`SELECT * FROM employee`, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
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
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Employees by Manager', 'View Employees by Department', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Manager', 'Delete Department', 'Delete Role', 'Delete Employee']
        }
    ]).then(({ choice }) => {
        continuedPropmt(choice);
    }).catch(err => {
        if (err) throw err;
    })
};

function continuedPropmt(choice) {
    let sql;
    let params = [];

    switch (choice) {
        //View Departments
        case 'View All Departments':
            sql = `SELECT * FROM department`

            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                primaryPrompt();
            });
            break;
        //View Roles
        case 'View All Roles':
            sql = `SELECT role.id, role.title, department.name AS department FROM role
            LEFT JOIN department ON role.department_id = department.id`

            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                primaryPrompt();
            });
            break;
        //View Employees
        case 'View All Employees':
            sql = `SELECT base.id, base.first_name, base.last_name, role.title AS title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee base
            LEFT JOIN role ON base.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON base.manager_id = manager.id`

            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
                primaryPrompt();
            });
            break;
        //Add a Department
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
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Added ${department} to the department table.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //Add a Role
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
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Added ${title} to the role table.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //Add an Employee
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
                if (manager === 'No Manager') {
                    managerId = null;
                } else {
                    managerId = employees.indexOf(manager) + 1;
                }
                sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)`;
                params = [first_name, last_name, roleId, managerId];
                db.query(sql, params, (err, row) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Added ${first_name} ${last_name} to the employee table.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //Update Employee Role
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
                sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                params = [roleId, employeeId]
                db.query(sql, params, (err, row) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Updated ${employee}'s role to ${role}'.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //Update Employee's Manager
        case 'Update Employee Manager':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Who would you like to update?',
                    choices: employees
                }, {
                    type: 'list',
                    name: 'manager',
                    message: 'Who would you like to be their manager?',
                    choices: employees
                }
            ]).then(({ employee, manager }) => {
                let managerId = employees.indexOf(manager) + 1;
                let employeeId = employees.indexOf(employee) + 1;
                sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
                params = [managerId, employeeId]
                db.query(sql, params, (err, row) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Updated ${employee}'s manager to ${manager}'.`);
                    updateTables();
                    primaryPrompt();
                })
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //View Employees by Manager
        case 'View Employees by Manager':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Select a manager to view their employees:',
                    choices: employees
                }
            ]).then(({ manager }) => {
                let managerId = employees.indexOf(manager) + 1;
                sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title AS role FROM employee
                JOIN role ON employee.role_id = role.id
                WHERE employee.manager_id = ?`,
                    params = [managerId]

                db.query(sql, params, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.table(rows);
                    primaryPrompt();
                });
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //View Employees by Department
        case 'View Employees by Department':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select a department to view their employees:',
                    choices: departments
                }
            ]).then(({ department }) => {
                let departmentId = departments.indexOf(department) + 1;
                sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title AS role FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                WHERE role.department_id = ?`
                params = [departmentId]

                db.query(sql, params, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.table(rows);
                    primaryPrompt();
                });
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //Delete a Department
        case 'Delete Department':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Pick a department you want to delete:',
                    choices: departments
                }
            ]).then(({ department }) => {
                let departmentId = departments.indexOf(department) + 1;
                sql = `DELETE FROM department WHERE department.id = ?`
                params = [departmentId]

                db.query(sql, params, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Deleted the ${department} Department.`);
                    updateTables();
                    primaryPrompt();
                });
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //Delete a Role
        case 'Delete Role':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'Pick a role you want to delete:',
                    choices: roles
                }
            ]).then(({ role }) => {
                let roleId = roles.indexOf(role) + 1;
                sql = `DELETE FROM role WHERE role.id = ?`
                params = [roleId]

                db.query(sql, params, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Deleted the ${role} role.`);
                    updateTables();
                    primaryPrompt();
                });
            }).catch(err => {
                if (err) throw err;
            })
            break;
        //Delete a Employee
        case 'Delete Employee':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Pick an employee you want to delete:',
                    choices: employees
                }
            ]).then(({ employee }) => {
                let employeeId = employees.indexOf(employee) + 1;
                sql = `DELETE FROM employee WHERE employee.id = ?`
                params = [employeeId]

                db.query(sql, params, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Deleted ${employee} form the table.`);
                    updateTables();
                    primaryPrompt();
                });
            }).catch(err => {
                if (err) throw err;
            })
            break;
    }
}

updateTables();
primaryPrompt();