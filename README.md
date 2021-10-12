# Employee Tracker
![GitHub issues](https://img.shields.io/github/issues/ZachYarbrough/employee-tracker) ![GitHub pull requests](https://img.shields.io/github/issues-pr/ZachYarbrough/employee-tracker) ![GitHub Repo stars](https://img.shields.io/github/stars/ZachYarbrough/employee-tracker?style=social) ![GitHub package.json version](https://img.shields.io/github/package-json/v/ZachYarbrough/employee-tracker)

## Description
This project stores information about employees, thier role, relations, and departments. This application uses inquirer to prompt the user with questions in the command line, mysql2 to store data in a sql database, and the console.table library to create a visual in order to keep track of employees.

## Table of Contents:
* [Installation](#installation)
* [Usage](#usage)
* [Walkthrough Video](#walkthrough-video)
* [Credits](#credits)

## Installation
This project requires node.js on your local machine.
```
npm i
mysql -u root -p
source db/db.sql;
source db/schema.sql;
```
For mock data use the seed file
```
source db/seeds.sql;
```
## Usage 

This project should be used as a tool to log and keep track of employees and their roles and relations. This application allows you to easily store information about your employees without losing track of information.

## Walkthrough Video
https://user-images.githubusercontent.com/70774264/133897349-72ed8c9b-4ece-4437-b864-4069bac59b34.mp4 

## Credits

UT Austin full stack web development bootcamp
