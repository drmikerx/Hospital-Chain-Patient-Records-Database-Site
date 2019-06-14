// Code in this file used the code in the following git repository as a foundation:
// https://github.com/knightsamar/CS340-Sample-Web-App

module.exports = function(){
    var express = require('express');
    var router = express.Router();

  // Display single patient's info for update page
  
    function getOnePatient(res, mysql, context, complete){
        mysql.pool.query("SELECT Fname, Lname, License FROM Hosp_Doctor;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.onepatient  = results;
            complete();
        });
}

  // When page loads, display patient's info to update
  
  router.get('/', function(req, res){
      /*
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        //getOnePatient(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 0){
                res.render('update_patient', context);
            }

        }
        
        */
      res.render('update_patient');
    });
    
    return router;
}();
