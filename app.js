//Require
const inquirer = require("inquirer");
const { prompt } = require("inquirer");
const mysql = require("mysql");
let connection = require("./connection");

beginSearch();
//addEmployee();

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
          addDeprtment();
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
  //Build an array of role choices
  let depChoice = [];
  var query = "SELECT id as value, department_name as name FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    depChoice = JSON.parse(JSON.stringify(res));
    var questions = [
      {
        type: "input",
        name: "title",
        message: "What is the name of the new role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this new role?"
      },
      {
        type: "list",
        name: "department",
        message: "Which department does the new role belong?",
        choices: depChoice
      }
    ];

    inquirer.prompt(questions).then(res => {
      console.log(res);
      const query =
        "INSERT INTO role (role_title, salary, department_id) VALUES (?, ?, ?)";
      connection.query(query, [res.title, res.salary, res.department], function(
        err,
        res
      ) {
        if (err) throw err;
        console.log("The role has been added.");
        beginSearch();
      });
    });
  });
} // end addRole() function

//-----------------------------------------------------------------------------------------//

function addEmployee() {
  let roleChoice = [];
  let querysql = "select id as value, role_title as name from role";
  connection.query(querysql, (err, res) => {
    if (err) throw err;
    roleChoice = JSON.parse(JSON.stringify(res));
    //console.log(roleChoice);
    //});

    var questions = [
      {
        name: "f_name",
        type: "input",
        message: "what is the first name?"
      },
      {
        type: "input",
        name: "l_name",
        message: "what is the last name?"
      },
      {
        type: "list",
        name: "role_title",
        message: "what is the role?",
        choices: roleChoice
      }
    ];
    inquirer.prompt(questions).then(res => {
      console.log(res);
      let querySql =
        "insert into employee (first_name, last_name, role_id) values (? , ? , ?)";
      connection.query(
        querySql,
        [res.f_name, res.l_name, res.role_title],
        function(err, data) {
          console.log("an employee has been added.");
          beginSearch();
        }
      );
    }); // end of the inquirer
  }); // end of connection query
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

function updateRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the new role ID that you would like to assign?",
        name: "updateRole"
      },
      {
        type: "input",
        message:
          "What is the ID number of the employee that you would like to update?",
        name: "updateId"
      }
    ])
    .then(function(answer) {
      connection.query(
        "UPDATE employee SET role_id = ? WHERE role_id = ?",
        [answer.updateRole, answer.updateId],
        function(err, res) {
          if (err) throw err;
          beginSearch();
        }
      );
    });
}
