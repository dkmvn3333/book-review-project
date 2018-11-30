var q = require("q");
var config = require("config");
var db = require("../commom/database");
var pool = db.pool;

function addUser(user){
    if(user){
        var defer = q.defer();
        pool.query('INSERT INTO user SET ?', user, function(err, result){
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
function getUserByEmail(email){
    if(email){
        var defer = q.defer();
        var query = pool.query("SELECT * FROM user WHERE ?",{email: email}, function(err, result){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
}
function getUserByEmailOfAdmin(email){
    if(email){
        var defer = q.defer();
        var query = pool.query("SELECT * FROM user WHERE email =? AND role_id = ?",[email,0], function(err, result){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
}
module.exports = {
    addUser: addUser,
    getUserByEmail:getUserByEmail,
    getUserByEmailOfAdmin:getUserByEmailOfAdmin
};