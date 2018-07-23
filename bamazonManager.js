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
        choices: ["View products for sale.", "View low inventory", "Add to inventory", "Add new product", "Nothing, I'm done."],
        name: "managerChoice"
    },
]).then(function(inquirerResponse) {

    switch (inquirerResponse.managerChoice) {
        case "View products for sale.":
            viewProducts();
        break;
        case "View low inventory":
            lowInv();
        break;
        case "Add to inventory":
            addInv();
        break;
        case "Add new product":
            newProduct();
        break;
        case "Nothing, I'm done.":
            console.log("Thanks!")
        break;
        default:
        break;
    };

});

function viewProducts() {

    let query = "SELECT * FROM products";
    connection.query(query, function (err, result, fields) {
        if (err) throw err;
        
        console.log(line);

        // Format the data for columnify
        let data = [];
        result.forEach(element => {

            data.push({
                Id: element.id,
                Name: element.product_name,
                Price: element.price,
                Available: element.stock_quantity
            });

        });

        console.log(columnify(data));

    });

};

function lowInv() {

    let query = "SELECT * FROM products";
    connection.query(query, function (err, result, fields) {

        if (err) throw err;

        let productObj = result.filter(function(obj) { return obj.stock_quantity <= 20; });
        
        console.log(line);

        // Format the data for columnify
        let data = [];
        productObj.forEach(element => {

            data.push({
                Id: element.id,
                Name: element.product_name,
                Price: element.price,
                Available: element.stock_quantity
            });

        });

        console.log(columnify(data));

    });    

};

function addInv() {

    connection.query("SELECT * FROM products", function(err, result, fields) {
        
    });

    inquirer.prompt([
        {
            type: "list",
            message: "Which item would you like to add?"
            
        }
    ])

}

