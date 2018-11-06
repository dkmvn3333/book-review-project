var config = require("config");
var mysql = require("mysql");

// var connection = mysql.createConnection({
//     host    : config.get("mysql.host"),
//     user    : config.get("mysql.user"),
//     password    : config.get("mysql.password"),
//     database    : config.get("mysql.database"),
//     queueLimit : 0, // unlimited queueing
//     connectionLimit : 10, // unlimited connections 
//     multipleStatements : true
// });

var pool  =mysql.createPool({
    host    : config.get("mysql.host"),
    user    : config.get("mysql.user"),
    password    : config.get("mysql.password"),
    database    : config.get("mysql.database"),
    queueLimit : 0, // unlimited queueing
    connectionLimit : 10, // unlimited connections 
    multipleStatements : true
});
// connection.connect();
// function getConnection(){
// //     if(connection){
// //         connection.connect();
// //     }
// //     return connection;
    
//     connection.connect(function(err) {
//         if (err) {
//             console.error('Error:- ' + err.stack);
//             return;
//         }
        
//         console.log('Connected Id:- ' + connection.threadId);
//     });
    
//     return connection;
//  };

module.exports ={
    // getConnection: getConnection,
    pool:pool
}
 