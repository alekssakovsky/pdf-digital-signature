const SELECT_V_SITE_BY_C_ID = 'SELECT v_site FROM vendors WHERE v_id = (SELECT c_vendor_id FROM customers WHERE c_id = 1)';

const mysql = require('mysql');
const dbConfig = require('./config/db-data');
const connection = mysql.createConnection(dbConfig);

connection.connect();
connection.query(SELECT_V_SITE_BY_C_ID, function (err, result) {
  if (err) throw err;
  console.log('result: ', result[0].v_site);
});
connection.end();
