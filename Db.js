'use strict';
//const SELECT_ALL_CUSTOMERS = 'SELECT c_id, customerN, v_site FROM customers JOIN vendors;';
const SELECT_CUSTOMERS_BY_HISTORY = 'SELECT c_id, customerN, v_site FROM customers JOIN vendors WHERE c_id > (SELECT h_customers_id FROM history WHERE h_id = 1) ORDER BY c_id DESC;';
const UPDATE_IN_HISTORY_LAST_ID_CUSTOMER = `UPDATE  history SET h_customers_id = ? WHERE h_id = 1;`;
const mysql = require('mysql');
const dbConfig = require('./config/db-data');

/**
 * Calls to the database,
 * returns the query result.
 *
 * @param {string} query
 * @param {string} insert
 *
 * @return {Promise<[]>}
 * a promise that returns array with data  if resolved
 * a promise that returns error if rejected
 * @resolve {[]}
 * @reject {string}
 * @typedef {error || string}
 * @property {string} error
 */
function dbConnect(query, insert ='') {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    connection.query(query, insert, function (error, result) {
      if (error || result.length === 0) {
        reject(error || 'new data not found. Exit with code 0');
      }
      else {
        resolve(result);
      }
      connection.end();
    });
  });
}

module.exports.dbConnect = dbConnect;
module.exports.SELECT_CUSTOMERS_BY_HISTORY = SELECT_CUSTOMERS_BY_HISTORY;
module.exports.UPDATE_IN_HISTORY_LAST_ID_CUSTOMER = UPDATE_IN_HISTORY_LAST_ID_CUSTOMER;
