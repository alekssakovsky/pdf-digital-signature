'use strict';
const SELECT_ALL_CUSTOMERS = 'SELECT * FROM customers JOIN vendors;';
const mysql = require('mysql');
const dbConfig = require('./config/db-data');


function dbConnect(query) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    connection.query(query, function (err, result) {
      if (err) reject(err);
      resolve(result);
      connection.end();
    });
  });
}

module.exports.dbConnect = dbConnect;
module.exports.SELECT_ALL_CUSTOMERS = SELECT_ALL_CUSTOMERS;
