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

// Query the database, and log each item with its price to the console for the customer to see.
function displayStock() {

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
                Price: element.price
            });

        });

        console.log(columnify(data));
        sellItems(result);

    });

};

// Start the prompt to the customer so they can buy stuff.
function sellItems(currentStock) {

    console.log(line + "\n");

    inquirer.prompt([
        {
            type: "input",
            message: "What would you like to buy? ",
            name: "productToBuy"
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "productQuantity"
        }
    ]).then(function (inquirerResponse) {

        // Returns the object associated with the product if it matches one, undefined if not.
        let productObj = currentStock.find(function (obj) { return obj.product_name === inquirerResponse.productToBuy.toLowerCase(); });

        // If the product is found, 
        if (productObj) {

            // Get the current available stock
            let selectedProductQuantity = productObj.stock_quantity;

            // If we have enough to fulfill the order, 
            if (selectedProductQuantity >= inquirerResponse.productQuantity) {

                // Query the database, and update the stock number.
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: selectedProductQuantity - inquirerResponse.productQuantity
                    },
                    {
                        product_name: inquirerResponse.productToBuy.toLowerCase()
                    }
                ], function (err, result, fields) {

                    if (err) throw err;

                    console.log("Total: " + inquirerResponse.productQuantity * productObj.price);

                    console.log("Thank you, come again.");

                    connection.end();

                });

            } else {

                console.log("We do not have sufficient stock to fullfil your order.");

            };

        } else {

            console.log("Product not found.");

        };

    });

};


displayStock();
