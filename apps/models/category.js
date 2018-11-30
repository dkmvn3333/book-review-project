var q = require("q");
var config = require("config");
var db = require("../commom/database");
var pool = db.pool;

function addCategory(category){
    if(category){
        var defer = q.defer();
        pool.query('INSERT INTO category SET ?', category, function(err, result){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}
function getAllCategories(){
    var defer = q.defer();
            pool.query('SELECT * FROM category ', function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function getCategoriesByID(category_id){
    var defer = q.defer();
            pool.query('SELECT * FROM category WHERE ?', {category_id:category_id}, function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function updateCategory(c){

    if(c){
        var defer = q.defer();
         pool.query('UPDATE category SET name = ?, discription = ?, category_image = ? WHERE category_id= ?', [c.name, c.discription, c.category_image, c.category_id], function(err, result){           
        //  pool.query(`UPDATE category SET name = '${c.name}', discription=${c.discription}, category_image=${c.category_image}  where category_id = ${c.category_id}`, function(err, result){
            if(err){
                console.log("error");
                defer.reject(err);
            }else{
                console.log("success");
                defer.resolve(result);
            }
        });
    return defer.promise;
    }
    return false;
}
function deleteCategory(category_id){
    console.log("id"+category_id);
    if(category_id){
        var defer = q.defer();
         pool.query('DELETE FROM category WHERE ?',{category_id:category_id}, function(err, result){           
            if(err){
                console.log("error");
                defer.reject(err);
            }else{
                console.log("success");
                defer.resolve(result);
            }
        });
    return defer.promise;
    }
    return false;
}
module.exports = {
    addCategory: addCategory,
    getAllCategories:getAllCategories,
    getCategoriesByID: getCategoriesByID,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory
};