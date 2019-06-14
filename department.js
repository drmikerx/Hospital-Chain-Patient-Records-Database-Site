// Code in this file used the code in the following git repository as a foundation:
// https://github.com/knightsamar/CS340-Sample-Web-App

module.exports = function(){
    var express = require('express');
    var router = express.Router();

  // Display departments for department page
  
    function getDepartments(res, mysql, context, complete){
        mysql.pool.query("SELECT Title FROM Hosp_Department;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.departments  = results;
            complete();
        });
}

  // When page loads, display all departments
  
  router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getDepartments(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('department', context);
            }

        }
    });
    
    // When user submits a new department, add it to the database and refresh page to display new row
    
    router.post('/', function(req, res){       
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Hosp_Department (Title) VALUES (?);";
        var inserts = [req.body.Title];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/department');
            }
        });
});
    
    return router;
}();
