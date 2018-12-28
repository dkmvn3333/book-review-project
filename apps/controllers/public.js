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
var assessment_md = require("../models/assessment");
var book_md = require("../models/book");
var helper = require("../helpers/helper");

router.get("/", function(req,res){
    var data = book_md.getAllBooksBest();
        data.then(function(books_best){
            data2 = book_md.getAllBooks2();
            data2.then(function(books){
                var data ={
                    books_best : books_best,
                    books : books,
                    error : false
                };
                res.render("public/index",{active : "home", data : data, user:false});
            }).catch(function(err){
                var data ={
                    categories:false,
                    error : "Could not get posts data",
                }
                res.render("public/index",{active : "home", data : data, user:false});
            });
            
        }).catch(function(err){
            var data ={
                categories:false,
                error : "Could not get posts data",
            }
            res.render("public/index",{active : "home", data : data, user:false});
        });
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
                    req.session.user_public = user;
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
    res.redirect("/signin");
});
router.get("/list_book", function(req,res){
    var data = book_md.getAllBooks2();
        data.then(function(books){
            var data ={
                books : books,
                error : false
            };
            res.render("public/list_book",{active : "list_book", data : data, user:false});
        }).catch(function(err){
            var data ={
                books:false,
                error : "Could not get posts data",
            }
            res.render("public/list_book",{active : "list_book", data : data, user:false});
        });
});
router.get("/detail_book/:id", function(req,res){
        var param = req.params;
        var id = param.id;
        console.log(id);
        var data = book_md.getBooksByID2(id);
        if(data){
            data.then(function(books){
                console.log(books.length);
                
                var data ={
                    books:books,
                    error : false,
                }
                res.render("public/detail_book", {active : "books",data:data , user:false});
            }).catch(function(err){
                var data ={
                    books:false,
                    error : "Couldn't get Book 2",
                }
                res.render("public/detail_book", {active : "books",data:data , user:false});
            });
        }else{
            var data ={
                books:false,
                error : "Couldn't get Book1",
            }
            res.render("public/detail_book", {active : "books",data:data , user:false});
        }
});
router.get("/post_assessment",function(req,res){
    res.render("public/post_assessment",{active: "post_assessment", data:{}});
});
router.get("/post_assessment/:id",function(req,res){
    var param = req.params;
        var id = param.id;
        console.log(id);
        var data = book_md.getBookByID(id);
        if(data){
            data.then(function(books){
                var book = books[0];
                console.log("ahihi :" +book.name_book);
                res.render("public/post_assessment", {active : "post_assessment",data:{book : book}, user:false});
            }).catch(function(err){
                res.render("public/post_assessment",{active: "post_assessment", data:{error:"Không có dữ liệu!", book:false, errors : errors}});
            });
        }else{
            res.render("public/post_assessment",{active: "post_assessment", data:{error:"Không có dữ liệu!", book:false, errors : errors}});
        }
});
router.post("/post_assessment", upload.single('picture') , function(req,res){
    var book_id = req.body.book_id;
    var user_id = req.body.user_id;
    var name_book = req.body.name_book;
    var author = req.body.author;
    var title = req.body.title;
    var quote = req.body.quote;
    var content = req.body.content;
    var rate = req.body.rate;

    if(req.file){
        console.log("Uploading File...");
        var picture = req.file.originalname;
    }else{
        console.log("No File Uploaded...");
        var picture = null;
    }

    console.log("rate "+ rate);
    

    // Form validator
    req.checkBody('name_book','Name book field is required').notEmpty();
    req.checkBody('author','Author field is required').notEmpty();
    req.checkBody('content','Content field is required').notEmpty();
    // Check Errors
    var errors = req.validationErrors();
    if(errors){
        console.log("Errors");
        if(book_id!=0){
            res.redirect("/post_assessment/"+book_id);
        }else{
            res.render("public/post_assessment",{active: "post_assessment", data:{errors : errors}});
        }
        
    }else{
        console.log("No Errors");
        var assessment ={
            title: title,
            content: content,
            user_id: user_id,
            like:0,
            picture: picture,
            quote: quote,
            name_book: name_book,
            author: author,
            status:0,
            rate:rate,
            book_id: book_id
        };
        console.log("preparing add assessment");
    
        var result = assessment_md.addAssessment(assessment);
        result.then(function(data){
            // res.json({message: "Insert success"});
            res.render("public/post_assessment",{active: "post_assessment", data:{msg:"Gửi bài đánh giá thành công!",errors : errors}});
        }).catch(function(err){
            console.log("Lỗi");
            res.render("public/post_assessment",{active: "post_assessment", data:{error: "Đã xãy ra lỗi!", errors : errors}});
        });
    }
});
router.get("/list_assessment", function(req,res){
        var data = assessment_md.getAllAssessments();
        data.then(function(assessments){
            var data ={
                assessments : assessments,
                error : false
            };
            res.render("public/list_assessment",{active : "list_assessment", data : data, user:false});
        }).catch(function(err){
            var data ={
                books:false,
                error : "Could not get posts data",
            }
            res.render("public/list_assessment",{active : "list_assessment", data : data, user:false});
        });
});
router.get("/detail_assessment/:id", function(req,res){
    var param = req.params;
        var id = param.id;
        console.log(id);
        var data = assessment_md.getAssessmentByID(id);
        if(data){
            data.then(function(assessments){
                var assessment = assessments[0];
                var data ={
                    assessment:assessment,
                    error : false,
                }
                res.render("public/detail_assessment", {active : "assessments",data:data , user:false});
            }).catch(function(err){
                var data ={
                    book:false,
                    error : "Couldn't get Assessment",
                }
                res.render("public/detail_assessment", {active : "assessments",data:data , user:false});
            });
        }else{
            var data ={
                book:false,
                error : "Couldn't get Assessment",
            }
            res.render("public/detail_assessment", {active : "assessments",data:data , user:false});
        }
});

router.get("/list_rate", function(req,res){
    res.render("public/list_rate",{active: "list_rate"});
});
module.exports = router;