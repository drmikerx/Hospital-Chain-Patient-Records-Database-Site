// Code in this file used the code in the following git repository as a foundation:
// https://github.com/knightsamar/CS340-Sample-Web-App

module.exports = function(){
    var express = require('express');
    var router = express.Router();

  // Display patients for patient page
  
    function getPatients(res, mysql, context, complete){
        mysql.pool.query("SELECT p.Id, p.Fname AS `FirstName`, p.Lname AS `LastName`, p.Gender AS `Gender`, p.Birthdate AS `DateofBirth`, p.Room AS `RoomNumber`, CONCAT(doc.Fname, ' ', doc.Lname) AS `Doctor`, b.name AS `Branch` FROM Hosp_Patient p INNER JOIN Hosp_Doctor doc ON p.Doctor = doc.Id LEFT JOIN Hosp_Branch b ON p.Branch = b.Id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.patients  = results;
            complete();
        });
}
    
    // Display doctors for doctor drop-down menu
    
    function getDoctors(res, mysql, context, complete){
        mysql.pool.query("SELECT Id, CONCAT(Fname,' ',Lname) AS `DoctorName` FROM Hosp_Doctor;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.doctors  = results;
            complete();
        });
}
    
    // Display branches for branch drop-down menu
    
    function getBranches(res, mysql, context, complete){
        mysql.pool.query("SELECT Id, Name FROM Hosp_Branch;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.branches  = results;
            complete();
        });
}

  // Select patients with close matching last names to search term
    
    function getPatientsWithLastNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT p.Id, p.Fname AS `FirstName`, p.Lname AS `LastName`, p.Gender AS `Gender`, p.Birthdate AS `DateofBirth`, p.Room AS `RoomNumber`, CONCAT(doc.Fname, ' ', doc.Lname) AS `Doctor`, b.name AS `Branch` FROM Hosp_Patient p INNER JOIN Hosp_Doctor doc ON p.Doctor = doc.Id LEFT JOIN Hosp_Branch b ON p.Branch = b.Id WHERE p.Lname LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.patients = results;
            complete();
        });
}
    
    // Preserve a copy of the row we are going to update so original values are not lost
    
    function getPatient(res, mysql, context, id, complete){
        var sql = "SELECT Id AS id, Fname, Lname, Gender, Birthdate, Room, Doctor, Branch FROM Hosp_Patient WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.patient = results[0];   // results contains array of objects only one was returned since id's are unique
            
            /************************* ADDED gender check - result here affects patient.handlebars file ****************/
            
            if(context.patient.Gender == 'F'){  // if patient was female we need the female option to be displayed in dropdown
                context.female = 1;
            }
            
            else{
                context.female = 0;     // means patient is male so Male should be displayed first in the drop down
            }
            
            //console.log(context.female);
            //console.log(context.patient); // Debugging
            complete();
        });
}
    
  // When page loads, display all patients
  
  router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepatient.js","searchpatients.js"];
        var mysql = req.app.get('mysql');
        getPatients(res, mysql, context, complete);
        getDoctors(res, mysql, context, complete);
        getBranches(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('patient', context);
            }

        }
    });
    
    // When user submits a new patient, add it to the database and refresh page to display new row
    
    router.post('/', function(req, res){       
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Hosp_Patient (Fname, Lname, Gender, Birthdate, Room, Doctor, Branch) VALUES (?,?,?,?,?,?,?);";
        var inserts = [req.body.Fname, req.body.Lname, req.body.Gender, req.body.Birthdate, req.body.Room, req.body.Doctor, req.body.Branch];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/patient');
            }
        });
});
    
    /*Display all patients whose last name starts with a given string. */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepatient.js","searchpatients.js"];
        var mysql = req.app.get('mysql');
        getPatientsWithLastNameLike(req, res, mysql, context, complete);
        getDoctors(res, mysql, context, complete);
        getBranches(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('patient', context);
            }
        }
});
    
    // router used to display the update patient page
    
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectGender.js","selectDoctor.js","selectBranch.js","updatepatient.js"];
        var mysql = req.app.get('mysql');
        getPatient(res, mysql, context, req.params.id, complete);
        getDoctors(res, mysql, context, complete);
        getBranches(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update_patient', context);
            }

        }
});
    
    // This route is used in the UPDATE process
    
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        //console.log(req.body)
        //console.log(req.params.id)
        var sql = "UPDATE Hosp_Patient SET Fname = ?, Lname = ?, Gender = ?, Birthdate = ?, Room = ?, Doctor = ?, Branch = ? WHERE id = ?";
        var inserts = [req.body.Fname, req.body.Lname, req.body.Gender, req.body.Birthdate, req.body.Room, req.body.Doctor, req.body.Branch, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
});
   
    
    /* Route to delete a patient, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Hosp_Patient WHERE Id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
})
    
    return router;
}();
