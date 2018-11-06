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


var category_md = require("../models/category");


router.get("/", function(req,res){
    res.render("admin/dashboard", {active : "dashboard"});
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
    var data = category_md.getAllCategories();
    data.then(function(categories){
        var data ={
            categories : categories,
            error : false
        };

        res.render("admin/categories",{active : "categories", data : data, msg: req.flash('msg')});
    }).catch(function(err){
        var data ={
            categories:false,
            error : "Could not get posts data",
        }
        res.render("admin/categories",{active : "categories", data : data, msg:false});
    });
});
router.get("/categories/add", function(req,res){
    res.render("admin/categories_add", {active : "categories",data:{errors:false, error:false}});
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
               req.flash('msg', 'Thêm danh mục thành công!')
              res.redirect("/admin/categories");
           }).catch(function(err){
               console.log("Lỗi");
               res.render("admin/categories_add",{active: "categories", data:{error: "Tên danh mục đã tồn tại!", errors : false}});
           });
       }
});
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
    res.render("admin/login");
});
module.exports = router;