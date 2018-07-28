// Get the node stuff
const mysql = require("mysql");
const inquirer = require("inquirer");
const columnify = require("columnify");

// For formatting
const line = "--------------------------------";

// Connect to the mysql database
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

start();

function start() {

    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View sales by department", "Create new department", "Nothing, I'm done."],
            name: "supervisorChoice"
        }
    ]).then(function (inquirerResponse) {

        switch (inquirerResponse.supervisorChoice) {
            case "View sales by department":
                viewSales();
                break;
            case "Create new department":
                newDepartment();
                break;
            case "Nothing, I'm done.":
                console.log("Thank you!");
                connection.end();
            break;
            default:
                break;
        };
    });
};

function viewSales() {

    // Add up the sales according to department
    let query = "SELECT SUM(products.product_sales) AS department_sales, departments.department_id, \
    departments.department_name, departments.over_head_costs \
    FROM departments \
    LEFT JOIN products ON departments.department_name = products.department_name \
    GROUP BY department_name \
    ORDER BY department_id";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;

        // Formatting
        let data = [];
        result.forEach(element => {

            data.push({
                Id: element.department_id,
                Department: element.department_name,
                Sales: element.department_sales,
                Overhead: element.over_head_costs,
                "Total Profit": element.department_sales - element.over_head_costs
            });
        });

        console.log(columnify(data));

        start();

    });
};

function newDepartment() {

    console.log("test");

    inquirer.prompt([
        {
            type: "input",
            message: "Enter a name for the new department: ",
            name: "department_name"
        },
        {
            type: "input",
            message: "What would the overhead of the new department? ",
            name: "overhead"
        }
    ]).then(function (inquirerResponse) {

        let query = "INSERT INTO departments (department_name, over_head_costs) VALUES ('" + inquirerResponse.department_name + "', '" + inquirerResponse.overhead + "');";
        connection.query(query, function (err, result, fields) {

            if (err) throw err;

            console.log("Created!");

            start();
        });


    });

};



