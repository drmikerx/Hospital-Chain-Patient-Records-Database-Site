var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_childrem',
  password        : '2316',
  database        : 'cs340_childrem',
  dateStrings     : 'date'
});
module.exports.pool = pool;
