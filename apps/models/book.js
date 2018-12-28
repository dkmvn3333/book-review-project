var q = require("q");
var config = require("config");
var db = require("../commom/database");
var pool = db.pool;

function addBook(book, book_review_id, check_categories){
    if(book){
        var defer = q.defer();
        pool.query('INSERT INTO book_tmp SET ?', book, function(err, result){
            if(err){
                defer.reject(err);
            }else{
                console.log("ID: "+result.insertId);
                console.log("Chiều dài: "+check_categories.length);
                
                for(var i=0; i< check_categories.length; i++){
                    console.log(i);
                    
                    pool.query('INSERT INTO book_category(book_id, category_id) VALUES(?,?)', [result.insertId, check_categories[i]], function(err, result){
                        if(err){
                            defer.reject(err);
                        }else{
                            console.log("");
                            console.log("Chiều dài: "+check_categories.length);
                        }
                    });
                }
                if(book_review_id!=0){
                    var data = getBookByID(result.insertId);
                    if(data){
                        data.then(function(books){
                            var book = books[0];
                            console.log("Book đây :");
                            console.log(book);
                            pool.query('UPDATE book_review SET book_id = ?, name_book =?, author =? WHERE book_review_id= ?', [book.book_id, book.name_book, book.author,book_review_id], function(err2, result2){           
                                //  pool.query(`UPDATE category SET name = '${c.name}', discription=${c.discription}, category_image=${c.category_image}  where category_id = ${c.category_id}`, function(err, result){
                                    if(err2){
                                        console.log("error");
                                    }else{
                                        console.log("success");
                                    }
                                });
                        })
                    }
                    
                }
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}
function getAllBooks2(){
    var defer = q.defer();
            pool.query('SELECT * FROM book_tmp INNER JOIN book_category ON book_tmp.book_id = book_category.book_id INNER JOIN category ON category.category_id = book_category.category_id', function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function getAllBooks(){
    var defer = q.defer();
            pool.query('SELECT * FROM book_tmp ORDER BY book_id DESC', function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function getBooksByID2(id){
    console.log(id);
    
    var defer = q.defer();
            pool.query('SELECT * FROM book_tmp INNER JOIN book_category ON book_tmp.book_id = book_category.book_id INNER JOIN category ON category.category_id = book_category.category_id WHERE book_tmp.book_id=?',[id], function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function getAllBooksBest(){
    var defer = q.defer();
            pool.query('SELECT * FROM book_tmp ORDER BY rate DESC limit 6', function(err, posts){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function getBookByID(book_id){
    var defer = q.defer();
            pool.query('SELECT * FROM book_tmp WHERE ?', {book_id:book_id}, function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function updateBook(book, check_categories){
    if(book){
        console.log("book_id"+book.book_id);
        
        var defer = q.defer();
         pool.query('UPDATE book_tmp SET name_book = ?, description = ?, pages = ?, image = ?, author =? WHERE book_id= ?', [book.name_book, book.description, book.pages, book.image, book.author , book.book_id], function(err, result){           
        //  pool.query(`UPDATE category SET name = '${c.name}', discription=${c.discription}, category_image=${c.category_image}  where category_id = ${c.category_id}`, function(err, result){
            if(err){
                console.log(err);
                defer.reject(err);
            }else{
                console.log("success");
                pool.query('DELETE FROM book_category WHERE ?',{book_id:book.book_id}, function(err, result){           
                    if(err){
                        console.log(err);
                        defer.reject(err);
                    }else{
                        console.log("success1");
                        defer.resolve(result);
                    }
                });
                for(var i=0; i< check_categories.length; i++){
                    console.log(i);
                    pool.query('INSERT INTO book_category(book_id, category_id) VALUES(?,?)', [book.book_id, check_categories[i]], function(err, result){
                        if(err){
                            console.log(err);
                            defer.reject(err);
                        }else{
                            console.log("success2");
                            console.log("Chiều dài: "+check_categories.length);
                        }
                    });
                }
                defer.resolve(result);
            }
        });
    return defer.promise;
    }
    return false;
}
function rateBooks(book_id,score){

    if(book_id){
        var defer = q.defer();
        pool.query('SELECT * FROM book_tmp WHERE ?', {book_id:book_id}, function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                var post = posts[0];
                score = parseFloat(post.rate)+(parseFloat(score)-parseFloat(post.rate))/(post.number_rate+1);
                console.log("score ( khong loi)"+score);
                
                pool.query('UPDATE book_tmp SET rate = ?, number_rate = ? WHERE book_id= ?', [score.toFixed(2), post.number_rate+1, book_id], function(err, result){           
                    //  pool.query(`UPDATE category SET name = '${c.name}', discription=${c.discription}, category_image=${c.category_image}  where category_id = ${c.category_id}`, function(err, result){
                        if(err){
                            console.log("error");
                            defer.reject(err);
                        }else{
                            console.log("success");
                            defer.resolve(result);
                }
            });
            defer.resolve(posts);
        }
        });
    return defer.promise;
    }
    return false;
}
function deleteBook(book_id){
    console.log("id"+book_id);
    if(book_id){
        var defer = q.defer();
         pool.query('DELETE FROM book_tmp WHERE ?',{book_id:book_id}, function(err, result){           
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
    addBook: addBook,
    getAllBooks:getAllBooks,
    getAllBooks2:getAllBooks2,
    getAllBooksBest:getAllBooksBest,
    getBookByID: getBookByID,
    getBooksByID2:getBooksByID2,
    updateBook: updateBook,
    deleteBook: deleteBook,
    rateBooks: rateBooks
};