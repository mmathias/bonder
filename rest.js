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
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table = ["user_login","user_email","user_password","name", req.body.email,md5(req.body.password), req.body.name];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                console.log(rows);
                res.json({"Error" : false, "Message" : "User Added !", "userId": rows.insertId});
            }
        });
    });
    router.get("/users", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["user_login"];
        query = mysql.format(query,table);
        console.log(query);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
        connection.on('error', function(err) {
            console.log('Error: ' + err);
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
                rows[0].user_password = md5(rows[0].user_password);
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });
    router.post("/users/login",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
        var table = ["user_login","user_email", req.body.email, "user_password", md5(req.body.password)];
        query = mysql.format(query,table);
        console.log(query);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });
    router.put("/users",function(req,res){
        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        var table = ["user_login","user_password",md5(req.body.password),"name",req.body.name,"user_email",req.body.email];
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
        var query = "INSERT INTO ??(??) VALUES (?)";
        var table = ["questions","question",req.body.question];
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
    router.get("/users/:userId/questions",function(req,res){
        var query = "SELECT * FROM questions q WHERE q.id NOT IN (SELECT question_id FROM answers WHERE user_id = ? AND challenged_user_id IS NULL)";
        var table = [req.params.userId];
        if (req.query.challenged !== 'null') {
            query = "SELECT * FROM questions q WHERE q.id NOT IN (SELECT question_id FROM answers WHERE user_id = ? AND challenged_user_id = ?)";
            table = [req.params.userId, req.query.challenged];
        }

        query = mysql.format(query,table);
        console.log(query);
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
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["questions",
          "question", req.body.question,
          "id",req.body.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the question: "+req.body.question});
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

    // Options
    router.get("/questions/:question_id/options",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["options","question_id",req.params.question_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Options" : rows});
            }
        });
    });

    // Answers
    router.post("/answers",function(req,res){
        var query = "INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)";
        var table = ["answers",
            "question_id", "user_id", "option_id", "challenged_user_id",
            req.body.question_id, req.body.user_id, req.body.option_id, req.body.challenged_user_id === 'null' ? null : req.body.challenged_user_id
        ];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Answer Added!"});
            }
        });
    });
    router.get("/users/:userId/answers",function(req,res){
        var query = "SELECT * FROM answers hisAnswers WHERE hisAnswers.user_id = ? AND hisAnswers.challenged_user_id IS NULL";
        var table = [
            req.params.userId
        ];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Score is ready!", "Answers": rows});
            }
        });
    });

    // Score
    router.get("/users/:userId/score/:challengedUserId",function(req,res){
        var query = "SELECT count(*) as score FROM answers hisAnswers, answers myAnswers WHERE hisAnswers.question_id = myAnswers.question_id AND hisAnswers.user_id = ? AND hisAnswers.challenged_user_id IS NULL AND myAnswers.user_id = ? AND myAnswers.challenged_user_id = ? AND hisAnswers.option_id = myAnswers.option_id";
        var table = [
            req.params.challengedUserId, req.params.userId, req.params.challengedUserId
        ];
        query = mysql.format(query,table);
        console.log(query);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                rows[0].challenged_user_id = req.params.challengedUserId;
                res.json({"Error" : false, "Message" : "Score is ready!", "Score": rows});
            }
        });
    });

    //Events
    router.get("/events",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["events"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Events" : rows});
            }
        });
    });
    router.get("/events/:eventId",function(req,res){
        var query = "SELECT * FROM events WHERE id=?";
        var table = [req.params.eventId];
        query = mysql.format(query,table);
        console.log(query);
        connection.query(query,function(err,rows){
            console.log(err);
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Event" : rows});
            }
        });
    });

    //Invitations
    router.post("/invitations",function(req,res){
        var query = "INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)";
        var table = ["invitations",
            "event_id", "invited_id", "inviter_id",
            req.body.event_id, req.body.invited_id, req.body.inviter_id
        ];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Invitation Added!"});
            }
        });
    });
    router.get("/invitations/:invitedId",function(req,res){
        var query = "SELECT * FROM invitations WHERE invited_id = ??";
        var table = [req.params.invited_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Invitation Added!"});
            }
        });
    });
}

module.exports = REST_ROUTER;
