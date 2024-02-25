const mysql = require("mysql2");
const axios = require("axios");

const db = mysql.createConnection({
  host: "127.0.0.1", // Replace with your host name
  user: "root", //  Replace with your database username
  password: "root", // Replace with your database password
});

db.connect((err) => {
  if (err) {
    console.log("Error in connecting to MySQL", err);
  }
  console.log("Connected to MySQL");

  // Create a database if it doesn't exist
  db.query("CREATE DATABASE IF NOT EXISTS node_mysql", (err, result) => {
    if (err) {
      console.log("Error in creating database", err);
    }
    console.log("Database created");
  });

  // Use the database
  db.query("USE node_mysql", (err, result) => {
    if (err) {
      console.log("Error in using database", err);
    }
    console.log("Using database");
  });

  // Create a table if it doesn't exist
  db.query(
    `CREATE TABLE IF NOT EXISTS PRODUCT_TRANSACTION (
            id INT AUTO_INCREMENT PRIMARY KEY,
            productTitle VARCHAR(255),
            price DECIMAL(10, 2),
            description TEXT,
            category VARCHAR(255),
            image VARCHAR(255),
            sold BOOLEAN,
            dateOfSale DATE
        )`,
    (err, result) => {
      if (err) {
        console.log("Error in creating table", err);
      } else {
        console.log("Table created");
        // Fetch data from third-party API
        axios
          .get("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
          .then((response) => {
            const jsonData = response.data;
            const values = jsonData.map((item) => [
              item.dateOfSale,
              item.productTitle,
              item.description,
              item.price,
              item.category,
              item.sold,
              item.image, // Assuming you also have an 'image' field
            ]);
            // Delete existing data
            db.query("DELETE FROM PRODUCT_TRANSACTION", (err, result) => {
              if (err) {
                console.log("Error in deleting data", err);
              } else {
                console.log("Data deleted");
                // Insert new data
                db.query(
                  "INSERT INTO PRODUCT_TRANSACTION (dateOfSale, productTitle, description, price, category, sold, image) VALUES ?",
                  [values],
                  (err, result) => {
                    if (err) {
                      console.log("Error in seeding data", err);
                    } else {
                      console.log("Data seeded");
                    }
                  }
                );
              }
            });
          })
          .catch((error) => {
            console.log("Error fetching data from API", error);
          });
      }
    }
  );
});

module.exports = db;