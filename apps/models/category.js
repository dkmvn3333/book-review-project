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
module.exports = {
    addCategory: addCategory,
    getAllCategories:getAllCategories
};