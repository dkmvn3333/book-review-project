var express =require("express");
var router = express.Router();

var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
var upload = multer({ storage: storage });

var session = require("express-session");




var user_md = require("../models/user");
var helper = require("../helpers/helper");

router.get("/", function(req,res){
    if(req.session){
        console.log(req.session);
    }else{
        console.log("No auth");
    }
    res.render("public/index",{active: "home",user : false});
});
router.get("/signup", function(req,res){
    res.render("public/signup",{active: "signup",data:{}});
});
router.post("/signup",upload.single('avatar'),function(req,res,next){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(req.file){
        console.log("Uploading File...");
        var avatar = req.file.originalname;
    }else{
        console.log("No File Uploaded...");
        var avatar = null;
    }

    // Form validator
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('repassword','Repassword field is required').equals(req.body.password);
    // Check Errors
    var errors = req.validationErrors();
    if(errors){
        console.log("Errors");
        res.render("public/signup",{active: "signup", data:{errors : errors}});
    }else{
        

        console.log("No Errors");
        var temp_password = helper.hash_password(req.body.password);
        var user ={
            name: name,
            email: email,
            password: temp_password,
            avatar: avatar,
            role_id: 0
        };
        console.log("preparing add user");
    
        var result = user_md.addUser(user);
        result.then(function(data){
            // res.json({message: "Insert success"});
            res.render("public/signup",{active: "signup", data:{msg:"Tạo tài khoản thành công!",errors : errors}});
        }).catch(function(err){
            console.log("Lỗi");
            res.render("public/signup",{active: "signup", data:{error: "Email đã tồn tại!", errors : errors}});
        });
    }
});
router.get("/signin", function(req,res){
    res.render("public/signin",{active: "signin",user : false,data:{}});
});
router.post("/signin", function(req, res){
    var params = req.body;
    console.log(req.body.active );
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','Password field is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        console.log("Errors");
        console.log(req.body.email+" "+req.body.password );
        res.render("public/signin",{active: "signin", data:{errors : errors}});
    }else{
        console.log("No Errors");
        var data = user_md.getUserByEmail(params.email);
        if (data){
            data.then(function(users){
                var user = users[0];

                var status = helper.compare_password(params.password, user.password);

                if(!status){
                   res.render("public/signin",{active: "signin", data: {error:"Password wrong"}});
                }else{
                    req.session.user = user;
                    console.log(req.session);
                    res.redirect("/")
                }
            }).catch(function(err){
                console.log("Lỗi");
                res.render("public/signin",{active: "signin", data:{error: "User not exists!"}});
            });
       }else{
           res.render("public/signin",{active: "signin", data: {error:"User not exists"}});
       }
    }
});
router.get("/logout", function(req,res){
    req.session.destroy();
    res.redirect("/");
});
router.get("/list_book", function(req,res){
    res.render("public/list_book",{active: "list_book"});
});
router.get("/detail_book", function(req,res){
    res.render("public/detail_book",{active: "detail_book"});
});
router.get("/list_assessment", function(req,res){
    res.render("public/list_assessment",{active: "list_assessment"});
});
router.get("/detail_assessment", function(req,res){
    res.render("public/detail_assessment",{active: "detail_assessment"});
});
router.get("/list_favourate", function(req,res){
    res.render("public/list_favourate",{active: "list_favourate"});
});
router.get("/list_rate", function(req,res){
    res.render("public/list_rate",{active: "list_rate"});
});
module.exports = router;