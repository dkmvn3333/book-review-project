var q = require("q");
var config = require("config");
var db = require("../commom/database");
var pool = db.pool;

function addAssessment(assessment){
    if(assessment){
        var defer = q.defer();
        pool.query('INSERT INTO book_review SET ?', assessment, function(err, result){
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
function getAllAssessments(){
    var defer = q.defer();
            pool.query('SELECT * FROM book_review ', function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function getAssessmentByID(assessment_id){
    var defer = q.defer();
            pool.query('SELECT * FROM book_review WHERE ?', {book_review_id:assessment_id}, function(err, posts){           
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
function changeStatusAssessment(assessment_id,value_status){

    if(assessment_id){
        var defer = q.defer();
         pool.query('UPDATE book_review SET status = ? WHERE book_review_id =?', [value_status,assessment_id], function(err, result){           
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
    addAssessment: addAssessment,
    getAllAssessments:getAllAssessments,
    getAssessmentByID: getAssessmentByID,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    changeStatusAssessment: changeStatusAssessment
};