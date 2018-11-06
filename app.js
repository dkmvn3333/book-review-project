var express = require("express");
var config = require("config");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var expressValidator = require("express-validator");
var LocalStrategy = require("passport-local").Strategy;
var multer = require("multer");
var upload = multer({dest:'./uploads'});
var flash = require("connect-flash");



var app = express();
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

      
// handle file uploads


// handle session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
// passport
app.use(passport.initialize());
app.use(passport.session());

// validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split(".")
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' +namespace.shift() +']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// ejs
app.set("views", __dirname+"/apps/views");
app.set("view engine", "ejs");

// Static folder
app.use("/static_admin", express.static(__dirname+"/templates/admin"));
app.use("/static_public", express.static(__dirname+"/templates/public"));
app.use("/uploads", express.static(__dirname+"/uploads"));

var controllers = require(__dirname+"/apps/controllers");
app.use(controllers);

var host = config.get("server.host");
var port = config.get("server.port");

app.listen(port,host, function(){
    console.log("Server is running on port", port);
});