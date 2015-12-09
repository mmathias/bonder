var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var rest = require("./rest.js");
var app = express();

function REST() {
    var self = this;
    self.connectMysql();
}

app.set('port', (process.env.PORT || 3000));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://superbonder.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

REST.prototype.connectMysql = function () {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit: 100,
        host: 'us-cdbr-iron-east-03.cleardb.net',
        user: 'b581c4263c48e1',
        password: '37075df0',
        database: 'heroku_bfba1a202047a6a',
        debug: false
    });

    self.configureExpress(pool);
};

REST.prototype.configureExpress = function (pool) {
    var self = this;
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);
    new REST(router, pool, md5);
    self.startServer();
};

REST.prototype.startServer = function () {
    app.listen(app.get('port'), function () {
        console.log("All right ! I am alive at Port " + app.get('port'));
    });
};

REST.prototype.stop = function (err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
};

new REST();
