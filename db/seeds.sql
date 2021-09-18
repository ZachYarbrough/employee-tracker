INSERT INTO department (name)
VALUE
    ('Marketing'),
    ('Software Engineering'),
    ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUE
    ('Marketing Analyst', 47000.00, 1),
    ('Marketing Consultant', 53000.00, 1),
    ('Front End Developer', 55000.00, 2),
    ('Back End Developer', 64000.00, 2),
    ('Recruiter', 49000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE
    ('Bob', 'Ross', 3, null),
    ('Mark', 'Wahlberg', 1, 1),
    ('Sarah', 'Conner', 2, 1),
    ('Ron', 'Weasley', 4, null),
    ('Steve', 'Jobs', 5, 4);
