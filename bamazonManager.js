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

// Get a look at the products table at the start of the program
let currentProductsTable;

function updateCurrent() {
    connection.query("SELECT * FROM products", function (err, result, fields) {
        if (err) throw err;
        currentProductsTable = result;
    });
};

updateCurrent();

inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View products for sale.", "View low inventory", "Add to inventory", "Add new product", "Nothing, I'm done."],
        name: "managerChoice"
    },
]).then(function (inquirerResponse) {

    switch (inquirerResponse.managerChoice) {
        case "View products for sale.":
            viewProducts(currentProductsTable);
            break;
        case "View low inventory":
            lowInv(currentProductsTable);
            break;
        case "Add to inventory":
            addInv(currentProductsTable);
            break;
        case "Add new product":
            newProduct(currentProductsTable);
            break;
        case "Nothing, I'm done.":
            console.log("Thanks!")
            break;
        default:
            break;
    };

});

function viewProducts(result) {

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

};

function lowInv(result) {

    let productObj = result.filter(function (obj) { return obj.stock_quantity <= 20; });

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

};

function addInv(result) {

    let choices = [];

    result.forEach(element => {
        choices.push(element.product_name);
    });

    inquirer.prompt([
        {
            type: "list",
            message: "Which item would you like to add?",
            choices: choices,
            name: "productToUpdate"
        },
        {
            type: "input",
            message: "How many to add?",
            name: "addQuantity"
        }
    ]).then(function(inquirerResponse) {

        let productObj = currentProductsTable.find(function (obj) { return obj.product_name === inquirerResponse.productToUpdate; });

        connection.query("UPDATE products SET ? WHERE ?",[
            {
                stock_quantity: productObj.stock_quantity + parseInt(inquirerResponse.addQuantity)
            },
            {
                product_name: inquirerResponse.productToUpdate
            }
        ], function(err, result, fields) {

            if (err) throw err;

            console.log("Quantity updated.");

            updateCurrent();

        });

    });

};

function newProduct(result) {

    inquirer.prompt([
        {
            type: "input",
            message: "Product name: ",
            name: "product_name"
        },
        {
            type: "list",
            message: "Department: ",
            name: "department",
            choices: ["Shoe", "Aerospace", "Electronics", "Grocery", "Pet"]
        },
        {
            type: "input",
            message: "Price: ",
            name: "price"
        },
        {
            type: "input",
            message: "Quantity: ",
            name: "quantity"
        }
    ]).then(function(inquirerResponse) {
        
        let query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('" + inquirerResponse.product_name + "', '" + inquirerResponse.department + "', '" + inquirerResponse.price + "', '" + inquirerResponse.quantity + "')";
        connection.query(query, function(err, result, fields) {
            if (err) throw err;

            console.log("product added!");

            updateCurrent();

        });
    });

};

