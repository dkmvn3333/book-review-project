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

var helper = require("../helpers/helper");
var category_md = require("../models/category");
var user_md = require("../models/user");
var assessment_md = require("../models/assessment");
var book_md = require("../models/book");

router.get("/", function(req,res){
    if(req.session.user){
        res.render("admin/dashboard", {active : "dashboard"});
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
});
router.get("/profile", function(req,res){
    if(req.session.user){
        res.render("admin/profile", {active : "profile"});
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
});
router.put("/profile/update", function(req, res){
    var params = req.body;
    console.log(params);
        if(params.name.trim().length == 0){
            res.json({status_code: 501})
        }else{
            req.session.user.address =params.address;
            req.session.user.contact = params.contact;
            req.session.user.about = params.about;
            console.log(req.session.user);
            
            data = user_md.updateUser(params);
            
            if(!data){
                res.json({status_code:500});
            }else{
                data.then(function(result){
                    res.json({status_code: 200});
                }).catch(function(err){
                    res.json({status_code: 500})
                })
            }
        }
    
})
router.get("/staffs", function(req,res){
    res.render("admin/staffs", {active : "staffs"});
});
router.get("/users", function(req,res){
    res.render("admin/users", {active : "users"});
});
router.get("/roles", function(req,res){
    res.render("admin/roles", {active : "roles"});
});
router.get("/books", function(req,res){
    if(req.session.user){
        var data = book_md.getAllBooks();
        data.then(function(books){
            var data ={
                books : books,
                error : false
            };

            res.render("admin/books",{active : "books", data : data, success_msg: req.flash('success_msg'),error_msg: req.flash('error_msg')});
        }).catch(function(err){
            var data ={
                books:false,
                error : "Could not get posts data",
            }
            res.render("admin/books",{active : "books", data : data, success_msg:false, error_msg:false});
        });
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
});
router.get("/books/add", function(req,res){
    if(req.session.user){
        var data = category_md.getAllCategories();
        data.then(function(categories){
            var data ={
                categories : categories,
                assessment : false,
                error : false,
                errors: false
            };

            res.render("admin/books_add",{active : "books", data : data});
        }).catch(function(err){
            var data ={
                categories:false,
                assessment : false,
                error : "Could not get posts data",
                errors: false
            }
            res.render("admin/books_add",{active : "books", data : data});
        });
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
    
});

router.get("/books/add/:id", function(req,res){
    if(req.session.user){
        var param = req.params;
        var id = param.id;
        console.log(id);
        var data = assessment_md.getAssessmentByID(id);
        if(data){
            data.then(function(assessments){
                var assessment = assessments[0];
                var data = category_md.getAllCategories();
                data.then(function(categories){
                    var data ={
                        categories : categories,
                        assessment : assessment,
                        error : false,
                        errors: false
                    };

                    res.render("admin/books_add",{active : "books", data : data});
                }).catch(function(err){
                    var data ={
                        categories:false,
                        assessment : assessment,
                        error : "Could not get posts data",
                        errors: false
                    }
                    res.render("admin/books_add",{active : "books", data : data});
                });
            }).catch(function(err){
                req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
                res.redirect("/admin/books");
            });
        }else{
            req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
            res.redirect("/admin/books");
        }
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
    
});
router.post("/books/add",upload.single('image') ,function(req,res){
    var name_book = req.body.name_book;
    var author = req.body.author;
    var pages = req.body.pages;
    var description = req.body.description;
    var check_categories = req.body.check_categories;
    console.log(check_categories.length);
    

    var book_review_id = req.body.assessment_id;


    console.log(name_book +" book id : "+book_review_id);
    if(req.file){
        console.log("Uploading File...");
        var image = req.file.originalname;
    }else{
        console.log("No File Uploaded...");
        var image = 'noimage.jpg';
    }
    req.checkBody('name_book','Name field is required').notEmpty();
    req.checkBody('author','Author field is required').notEmpty();
    req.checkBody('pages','Page field is required').notEmpty();
    req.checkBody('description','Description field is required').notEmpty();
       // Check Errors
       var errors = req.validationErrors();
       if(errors){
           console.log("Errors");
           var data = assessment_md.getAssessmentByID(book_review_id);
           if(data){
            data.then(function(assessments){
                var assessment = assessments[0];
                console.log("ahihi :" +assessment.title);
                res.render("admin/books_add", {active : "books",data:{assessment : assessment, errors:errors, error:false}});
            }).catch(function(err){
                req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
                res.redirect("/admin/books");
            });}
       }else{
           console.log("No Errors");

           var book ={
                name_book: name_book,
                pages: pages,
                description: description,
                rate: 5,
                author_id: 0,
                image: image,
                author: author,
           };
           console.log("preparing add category");
           console.log(book);
           
           var result = book_md.addBook(book, book_review_id,check_categories );
           result.then(function(data){
               // res.json({message: "Insert success"});
                req.flash('success_msg', 'Thêm danh mục thành công!');
              res.redirect("/admin/books");
           }).catch(function(err){
                var assessment = assessments[0];
                var data = category_md.getAllCategories();
                data.then(function(categories){
                    var data ={
                        categories : categories,
                        assessment : assessment,
                        error : "Tên danh mục đã tồn tại!",
                        errors: false
                    };
                    res.render("admin/books_add",{active: "books", data:data});
                })
           });
           
       }
});
router.get("/books/edit/:id", function(req,res){
    if(req.session.user){
        var param = req.params;
        var id = param.id;
        var data = book_md.getBooksByID2(id);
        if(data){
            data.then(function(books){
                var data = category_md.getAllCategories();
                data.then(function(categories){
                    var data ={
                        categories : categories,
                        books : books,
                        error : false,
                        errors: false
                    };

                    res.render("admin/books_edit",{active : "books", data : data});
                }).catch(function(err){
                    var data ={
                        categories:false,
                        books : books,
                        error : "Could not get posts data",
                        errors: false
                    }
                    res.render("admin/books_edit",{active : "books", data : data});
                });
            }).catch(function(err){
                req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
                res.redirect("/admin/books");
            });
        }else{
            req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
            res.redirect("/admin/books");
        }
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
    
});
router.post("/books/edit/:id",upload.single('image') ,function(req,res){
    var param = req.params;
    var book_id = param.id;
    var name_book = req.body.name_book;
    var description = req.body.description;
    var author = req.body.author;
    var pages = req.body.pages;
    var check_categories = req.body.check_categories;
    var pre_image = req.body.pre_image;
    console.log(check_categories.length);

    if(req.file){
        console.log("Uploading File...");
        var image = req.file.originalname;
    }else{
        console.log("No File Uploaded...");
        var image = pre_image;
    }
    req.checkBody('name_book','Name field is required').notEmpty();
    req.checkBody('pages','Pages field is required').notEmpty();
    req.checkBody('author','Author field is required').notEmpty();
    req.checkBody('description','Description field is required').notEmpty();
       // Check Errors
       var errors = req.validationErrors();
       if(errors){
           console.log("Errors");
           var data = book_md.getBooksByID2(book_id);
            if(data){
                data.then(function(books){
                    var data = category_md.getAllCategories();
                    data.then(function(categories){
                        var data ={
                            categories : categories,
                            books : books,
                            error : false,
                            errors: errors
                        };

                        res.render("admin/books_edit",{active : "books", data : data});
                    }).catch(function(err){
                        var data ={
                            categories:false,
                            books : books,
                            error : "Could not get posts data",
                            errors: errors
                        }
                        res.render("admin/books_edit",{active : "books", data : data});
                    });
                }).catch(function(err){
                    req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
                    res.redirect("/admin/books");
                });
            }
       }else{
           console.log("No Errors");

           var book ={
               book_id: book_id,
               name_book: name_book,
               description: description,
               pages: pages,
               image: image,
               author: author,
           };
           console.log("preparing edit books");

           var result = book_md.updateBook(book,check_categories);
           result.then(function(data){
               // res.json({message: "Insert success"});
               req.flash('success_msg', 'Thêm danh mục thành công!');
              res.redirect("/admin/books");
           }).catch(function(err){
            req.flash('error_msg', 'Lỗi thao tác!');
            res.redirect("/admin/books");
           });
       }
});
router.delete("/books/delete", function(req, res){
    var book_id = req.body.book_id;
    console.log("id: "+book_id);
    
    data = book_md.deleteBook(book_id);
    if(!data){
        res.json({status_code:500});
    }else{
        data.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500})
        })
    }
})
router.get("/categories", function(req,res){
    if(req.session.user){
        var data = category_md.getAllCategories();
        data.then(function(categories){
            var data ={
                categories : categories,
                error : false
            };

            res.render("admin/categories",{active : "categories", data : data, success_msg: req.flash('success_msg'),error_msg: req.flash('error_msg')});
        }).catch(function(err){
            var data ={
                categories:false,
                error : "Could not get posts data",
            }
            res.render("admin/categories",{active : "categories", data : data, success_msg:false, error_msg:false});
        });
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
    
});
router.get("/categories/add", function(req,res){
    if(req.session.user){
        res.render("admin/categories_add", {active : "categories",data:{errors:false, error:false}});
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
    
});
router.post("/categories/add",upload.single('category_image') ,function(req,res){
    var name = req.body.name;
    var discription = req.body.discription;
    console.log(name +" "+discription);
    if(req.file){
        console.log("Uploading File...");
        var image = req.file.originalname;
    }else{
        console.log("No File Uploaded...");
        var image = 'noimage.jpg';
    }
    req.checkBody('name','Name field is required').notEmpty();
       // Check Errors
       var errors = req.validationErrors();
       if(errors){
           console.log("Errors");
           res.render("admin/categories_add",{active: "categories", data:{errors : errors, error:false}});
       }else{
           console.log("No Errors");

           var category ={
               name: name,
               discription: discription,
               category_image: image
           };
           console.log("preparing add category");
       
           var result = category_md.addCategory(category);
           result.then(function(data){
               
               // res.json({message: "Insert success"});
               req.flash('success_msg', 'Thêm danh mục thành công!');
              res.redirect("/admin/categories");
           }).catch(function(err){
               console.log(err);
               res.render("admin/categories_add",{active: "categories", data:{error: "Tên danh mục đã tồn tại!", errors : false}});
           });
       }
});
router.get("/categories/edit/:id", function(req,res){
    if(req.session.user){
        var param = req.params;
        var id = param.id;
        var data = category_md.getCategoriesByID(id);
        if(data){
            data.then(function(categories){
                var category = categories[0];
                console.log("ahihi :" +category.name);
                res.render("admin/categories_edit", {active : "categories",data:{category : category, errors:false, error:false}});
            }).catch(function(err){
                req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
                res.redirect("/admin/categories");
            });
        }else{
            req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
            res.redirect("/admin/categories");
        }
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
    
});
router.put("/categories/edit",upload.single('category_image'), function(req, res){
    var params = req.body;
    console.log(params);
        if(params.name.trim().length == 0){
            res.json({status_code: 501})
        }else{
            data = category_md.updateCategory(params);
            if(!data){
                res.json({status_code:500});
            }else{
                data.then(function(result){
                    res.json({status_code: 200});
                }).catch(function(err){
                    res.json({status_code: 500})
                })
            }
        }
    
})
router.delete("/categories/delete", function(req, res){
    var category_id = req.body.category_id;
    console.log("id"+category_id);
    
    data = category_md.deleteCategory(category_id);
    if(!data){
        res.json({status_code:500});
    }else{
        data.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500})
        })
    }
})
router.get("/authors", function(req,res){
    res.render("admin/authors", {active : "authors"});
});
router.get("/translators", function(req,res){
    res.render("admin/translators", {active : "translators"});
});
router.get("/assessments", function(req,res){
    if(req.session.user){
        var data = assessment_md.getAllAssessments();
        data.then(function(assessments){
            var data ={
                assessments : assessments,
                error : false
            };

            res.render("admin/assessments",{active : "assessments", data : data, success_msg: req.flash('success_msg'),error_msg: req.flash('error_msg')});
        }).catch(function(err){
            var data ={
                categories:false,
                error : "Could not get posts data",
            }
            res.render("admin/assessments",{active : "assessments", data : data, success_msg:false, error_msg:false});
        });
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
});
router.put("/assessments/change_status", function(req, res){
    var assessment_id = req.body.assessment_id;
    var value_status = req.body.value_status;
    console.log("id :"+assessment_id+" status :"+value_status);
    if (value_status==0) {
        value_status=1;
    }else{value_status=0;}
    data = assessment_md.changeStatusAssessment(assessment_id,value_status);
    if(!data){
        res.json({status_code:500});
    }else{
        data.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500})
        })
    }
})
router.put("/books/rate", function(req, res){
    var book_id = req.body.book_id;
    var score = req.body.score;
    console.log("book_id :"+book_id+" score :"+score);
    data = book_md.rateBooks(book_id,score);
    if(!data){
        res.json({status_code:500});
    }else{
        data.then(function(posts){
            var post = posts[0];
            console.log(post.number_rate);
            score = parseFloat(post.rate)+(parseFloat(score)-parseFloat(post.rate))/(post.number_rate+1);
            
            res.json({status_code: 200, score:score, number_rate:post.number_rate});
        }).catch(function(err){
            res.json({status_code: 500})
        })
    }
})
router.get("/comments", function(req,res){
    res.render("admin/comments", {active : "comments"});
});
router.get("/login", function(req,res){
        res.render("admin/login",{data:{error: false}, error_msg: req.flash('error_msg')});
});
router.post("/login", function(req,res){
    var params = req.body;
    console.log(req.body.active );
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','Password field is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        console.log("Errors");
        console.log(req.body.email+" "+req.body.password );
        res.render("/signin",{data:{errors : errors}});
    }else{
        console.log("No Errors");
        var data = user_md.getUserByEmailOfAdmin(params.email);
        if (data){
            data.then(function(users){
                var user = users[0];

                var status = helper.compare_password(params.password, user.password);

                if(!status){
                    console.log("Lỗi1");
                   res.render("admin/login",{data: {error:"Password wrong"},error_msg: false});
                }else{
                    req.session.user = user;
                    res.redirect("/admin")
                }
            }).catch(function(err){
                console.log("Lỗi");
                res.render("admin/login",{data:{error: "User not exists!"},error_msg: false});
            });
       }else{
            console.log("Lỗi");
           res.render("admin/login",{data: {error:"User not exists"},error_msg: false});
       }
    }
});
router.get("/logout", function(req,res){
    req.session.destroy();
    res.redirect("/admin/login");
});
module.exports = router;