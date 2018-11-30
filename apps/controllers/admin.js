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

router.get("/", function(req,res){
    if(req.session.user){
        res.render("admin/dashboard", {active : "dashboard"});
    }else{
        req.flash('error_msg', 'Vui lòng đăng nhập với quyền Admin!');
        res.redirect("/admin/login");
    }
    
});
router.get("/profile", function(req,res){
    res.render("admin/profile", {active : "profile"});
});
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
    res.render("admin/books", {active : "books"});
});
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
               console.log("Lỗi");
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
    res.render("admin/assessments", {active : "assessments"});
});
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
                    console.log(req.session.user);
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