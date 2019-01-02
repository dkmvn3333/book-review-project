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
                const groupByID = posts.reduce((newposts, post) => {
                    if(!newposts[post.book_id]) {
                        newposts[post.book_id] = {
                        book_id: post.book_id,
                        name_book: post.name_book,
                        pages: post.pages,
                        description: post.description,
                        rate: post.rate,
                        image: post.image,
                        number_rate: post.number_rate,
                        category_id: [post.category_id],
                        name: [post.name],
                      }
                      return newposts;
                    }
                    newposts[post.book_id].book_id = post.book_id;
                    newposts[post.book_id].name_book = post.name_book;
                    newposts[post.book_id].pages = post.pages;
                    newposts[post.book_id].description = post.description;
                    newposts[post.book_id].rate = post.rate;
                    newposts[post.book_id].image = post.image;
                    newposts[post.book_id].number_rate = post.number_rate;
                    newposts[post.book_id].author = post.author;
                    newposts[post.book_id].category_id.push(post.category_id);
                    newposts[post.book_id].name.push(post.name)
                    return newposts;
                  
                  }, {});
                  
                    posts = Object.keys(groupByID).map(key => {
                    const post = groupByID[key];
                    return post;
                  });
                //   console.log(posts);
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
function getBooksByKey(key_book, category_id){
    console.log(category_id);
    var result ="";
    if(category_id!=0){
        result =" AND category.category_id = "+category_id;
    }
    console.log(result);
    var defer = q.defer();
            pool.query('SELECT * FROM book_tmp INNER JOIN book_category ON book_tmp.book_id = book_category.book_id INNER JOIN category ON category.category_id = book_category.category_id WHERE book_tmp.name_book LIKE "%'+key_book+'%"' + result, function(err, posts){           
            if(err){
                defer.reject(err);
            }else{
                const groupByID = posts.reduce((newposts, post) => {
                    if(!newposts[post.book_id]) {
                        newposts[post.book_id] = {
                        book_id: post.book_id,
                        name_book: post.name_book,
                        pages: post.pages,
                        description: post.description,
                        rate: post.rate,
                        image: post.image,
                        number_rate: post.number_rate,
                        author: post.author,
                        category_id: [post.category_id],
                        name: [post.name],
                      }
                      return newposts;
                    }
                    newposts[post.book_id].book_id = post.book_id;
                    newposts[post.book_id].name_book = post.name_book;
                    newposts[post.book_id].pages = post.pages;
                    newposts[post.book_id].description = post.description;
                    newposts[post.book_id].rate = post.rate;
                    newposts[post.book_id].image = post.image;
                    newposts[post.book_id].number_rate = post.number_rate;
                    newposts[post.book_id].author = post.author;
                    newposts[post.book_id].category_id.push(post.category_id);
                    newposts[post.book_id].name.push(post.name)
                    return newposts;
                  
                  }, {});
                  
                    posts = Object.keys(groupByID).map(key => {
                    const post = groupByID[key];
                    return post;
                  });
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
function getAllBooksBest2(){
    var defer = q.defer();
            pool.query('SELECT * FROM book_tmp ORDER BY rate DESC', function(err, posts){
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
    getAllBooksBest2:getAllBooksBest2,
    getBookByID: getBookByID,
    getBooksByID2:getBooksByID2,
    getBooksByKey:getBooksByKey,
    updateBook: updateBook,
    deleteBook: deleteBook,
    rateBooks: rateBooks
};