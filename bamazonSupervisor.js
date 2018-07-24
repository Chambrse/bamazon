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

inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View sales by department", "Create new department"],
        name: "supervisorChoice"
    }
]).then(function(inquirerResponse) {

    switch (inquirerResponse.supervisorChoice) {
        case "View sales by department":
            viewSales();
        break;
        case "Create new department":
            newDepartment();
        break;
        default:
        break;
    };

});

function viewSales() {
    
    let query = "SELECT SUM(products.product_sales) AS department_sales, departments.department_id, departments.department_name, departments.over_head_costs FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_name ORDER BY department_id";
    connection.query(query, function(err, result, fields) {
        if (err) throw err;

        console.log(result);

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
        
    });


}



