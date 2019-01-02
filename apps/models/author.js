var q = require("q");
var config = require("config");
var db = require("../commom/database");
var pool = db.pool;

function addAuthor(author){
    if(author){
        var defer = q.defer();
        pool.query('INSERT INTO author SET ?', author, function(err, result){
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
function getAllAuthors(){
    var defer = q.defer();
            pool.query('SELECT * FROM author ', function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function getAuthorsByID(author_id){
    var defer = q.defer();
            pool.query('SELECT * FROM author WHERE ?', {author_id:author_id}, function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function updateAuthor(c){
    if(c){
        var defer = q.defer();
         pool.query('UPDATE author SET name = ?, description = ? ,author_image = ? WHERE author_id= ?', [c.name, c.discription,c.birthday,c.nationnality , c.author_image, c.author_id], function(err, result){           
        //  pool.query(`UPDATE author SET name = '${c.name}', discription=${c.discription}, author_image=${c.author_image}  where author_id = ${c.author_id}`, function(err, result){
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
function deleteAuthor(author_id){
    console.log("id"+author_id);
    if(author_id){
        var defer = q.defer();
         pool.query('DELETE FROM author WHERE ?',{author_id:author_id}, function(err, result){           
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
    addAuthor: addAuthor,
    getAllAuthors: getAllAuthors,
    getAuthorsByID: getAuthorsByID,
    updateAuthor: updateAuthor,
    deleteAuthor:deleteAuthor
};