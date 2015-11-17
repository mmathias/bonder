var mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
    router.get("/", function(req, res){
        res.json({"Message" : "Hello World !"});
    });

    router.post("/users",function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["user_login","user_email","user_password",req.body.email,md5(req.body.password)];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });
    router.get("/users",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["user_login"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });
    router.get("/users/:user_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["user_login","user_id",req.params.user_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });
    router.post("/users/login",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
        var table = ["user_login","user_email", req.params.user_email, "user_password", req.params.user_password];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });
    router.put("/users",function(req,res){
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["user_login","user_password",md5(req.body.password),"user_email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
            }
        });
    });
    router.delete("/users/:email",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user_login","user_email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
            }
        });
    });


    // Questions

    router.post("/questions",function(req,res){
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table = [
          "questions","question","firstOption","secondOption",
          req.body.question,req.body.firstOption,req.body.secondOption];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Question Added!"});
            }
        });
    });
    router.get("/questions",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["questions"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Questions" : rows});
            }
        });
    });
    router.get("/questions/:question_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["questions","id",req.params.question_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Questions" : rows});
            }
        });
    });
    router.put("/questions",function(req,res){
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var table = ["questions",
          "question", req.body.question,
          "firstOption", req.body.firstOption,
          "secondOption", req.body.secondOption,
          "id",req.body.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the question ID "+req.body.id});
            }
        });
    });
    router.delete("/questions/:id",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["questions","id",req.params.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the question with ID "+req.params.id});
            }
        });
    });
}

module.exports = REST_ROUTER;
