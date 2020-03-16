//Require
const inquirer = require("inquirer");
const { prompt } = require("inquirer");
const mysql = require("mysql");
let connection = require("./connection");

//beginSearch();
addRole();

function beginSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Employees",
        "View Departments",
        "View Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Role",
        "Exit"
      ]
    })
    .then(answers => {
      switch (answers.action) {
        case "View Employees":
          showEmployees();
          break;
        case "View Departments":
          showDepartments();
          break;
        case "View Roles":
          showRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Role":
          updateRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
} // end beginSearch function

//--------------------------------------------------------------------------//

function addDeprtment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Enter the name of the department you want to add"
    })
    .then(function(respond) {
      let querysql = "insert into department (department_name) values (?)";
      connection.query(querysql, [respond.department], function(err, res) {
        if (err) throw err;
        console.log("The department has been added");
        beginSearch();
      });
    });
} //end addDepartment function

//-----------------------------------------------------------------------------//

function addRole() {
  var roleChoices = [];
  let querysql = "select department_name as name from department";
  connection.query(querysql, function(err, data) {
    if (err) throw err;
    roleChoices = JSON.parse(JSON.stringify(data));
    //console.log(data);
  });
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "what is the role you would like to add?"
      },
      {
        name: "salary",
        type: "input",
        message: "what is the salary for this role?"
      },
      {
        name: "id",
        type: "list",
        message: "what is the department id?",
        choices: roleChoices.name
      }
    ])
    .then(function(respond) {
      let querySql =
        "insert into role (role_title, salary, department_id) values (? , ? , ?)";
      connection.query(
        querySql,
        [respond.role, respond.salary, respond.id],
        (err, data) => {
          if (err) throw err;
          console.log("this role has been added");
          beginSearch();
        }
      );
    });
} // end addRole() function

//-----------------------------------------------------------------------------------------//

function addEmployee() {
  let roleChoice = [];
  let querysql = "select id as value, role_title as name from role";
  connection.query(querysql, (err, data) => {
    if (err) throw err;
    roleChoice = JSON.stringify(data);
  });
  inquirer
    .prompt(
      {
        name: "f_name",
        type: "input",
        message: "what is the first name?"
      },
      {
        name: "l_name",
        type: "input",
        message: "what is the last name?"
      },
      {
        name: "role_title",
        type: "list",
        message: "what is the role?",
        choices: roleChoice
      }
    )
    .then(function(respond) {
      let querySql =
        "insert into employee (first_name, last_name, role_id) values (? , ? , ?)";
      connection.query(
        querysql,
        [respond.f_name, respond.l_name, respond.role_title],
        function(err, data) {}
      );
    });
} // end addEmployee function

//-----------------------------------------------------------------------------------------//

function showEmployees() {
  var query = "SELECT * FROM employee";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    beginSearch();
  });
} // end showEployee function
//--------------------------------------------------------------//

function showDepartments() {
  var query = "SELECT * FROM department ";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    beginSearch();
  });
} // end showDepartment fucntion
//---------------------------------------------------------------//

function showRole() {
  var query = "SELECT * FROM role ";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    beginSearch();
  });
} // end showRole function
//---------------------------------------------------------------//

// const departmentChoices = departments.map(({ id, name }) => ({
//   name: name,
//   value: id
// }));
// const role = await prompt([
//   { name: "title", message: "What is the name of the role?" },
//   { name: "salary", message: "What is the salary of the role?" },
//   {
//     type: "list",
//     name: "department_id",
//     message: "Which department does the role belong to?",
//     choices: departmentChoices
//   }
// ]);
