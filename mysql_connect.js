/**
 * New node file
 */
var mysql      = require('mysql');

var pool = mysql.createPool({
host : 'localhost',
user : 'root',
password : 'pass',
database : 'test'
});


	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'pass',
	  port: '3306',
	  database: 'test'
	});
	 
	connection.connect();
  var sql = '';

function getFromCart(cb){
	sql = 'SELECT * FROM cart';
	  connection.query(sql, function (err, result) {
	    if (err) return cb(err);
	    cb(null, result);
	  });

}


function getFromProduct(cb){
	sql = 'SELECT * FROM product';
	  connection.query(sql, function (err, result) {
	    if (err) return cb(err);
	    cb(null, result);
	  });

}

function deleteall(cb){
	sql = 'DELETE FROM cart';
	connection.query(sql, function (err, result) {
	if (err) {return cb(err);}
	cb(null, result);
	});

}

function deleteFromCart(cb,pname,pdesc,pprice,pqty) {
	var sql = 'DELETE FROM cart WHERE pname='+pname+'and pprice='+pprice;
	db.query(sql, function (err, result) {
	if (err) return cb(err);
	cb(null, result);
	});
}

function insertLoginTime(cb,fname,pwd) {
	  var nw = new Date();
	  sql = 'Update users set llogin=now() where fname="'+fname+'" and pwd="'+pwd+'"';
	  connection.query(sql, function (err, result) {
	    if (err) return cb(err);
	    cb(null, result);
	  });
	}

function insertIntoCart(c1,c2,c3,c4,cb) {
	console.log(c1+c2+c4+c4);
	  sql = 'Insert into cart (`pname`,`pdesc`,`pprice`,`pqty`) values ("'+c1+'","'+c2+'",'+c3+','+c4+')';
	  //var values = posts.map(function (post) {
		//    return [post];
		 // });
		  
		  connection.query(sql, function (err, result) {
		    if (err) return cb(err);
		    //cb(null, result);
		  });
		  sql = 'SELECT *,pprice*pqty as "tp" FROM cart';
		  connection.query(sql, function (err, result) {
		    if (err) return cb(err);
		    cb(null, result);
		  });
	}


function deleteFromCart(c1,cb) {
	
	console.log(c1);
	  sql = 'Delete from cart where pid='+c1;
	  //var values = posts.map(function (post) {
		//    return [post];
		 // });
		  
		  connection.query(sql, function (err, result) {
		    if (err) return cb(err);
		    //cb(null, result);
		  });
		  sql = 'SELECT *,pprice*pqty as "tp" FROM cart';
		  connection.query(sql, function (err, result) {
		    if (err) return cb(err);
		    cb(null, result);
		  });
	}

function lastCart(cb) {
	  	  sql = 'Update product,cart set product.pavl=product.pavl-cart.pqty where product.pname=cart.pname';		  
		  connection.query(sql, function (err, result) {
		    if (err) return cb(err);
		    //cb(null, result);
		  });
		  sql = 'SELECT * FROM cart';
		  connection.query(sql, function (err, result) {
		    if (err) return cb(err);
		    
		    connection.query('delete from cart', function (err, result) {
		    	if (err) return cb(err);
			  });
		   cb(null, result);
		  });
	}









function connect() {
sql = 'CREATE TABLE PERSON(id int,name varchar(20))';

connection.query(sql, function(err, res) {
	if(err){
		console.log("ERROR: " + err.message);
	}else{
		console.log("SQL DB CONNECTED AND TABLE CREATED");
	}
	
	 
});
}

function insertAndQuery(fname,lname,email,pwd){
 sql = 'INSERT INTO users VALUES("'+fname+'","'+lname+'","'+email+'","'+pwd+'")';
	connection.query(sql, function(err, results) {
		if (err) {
            console.log("ERROR: " + err.message);
        }
		else{
		console.log("values inserted");	
		console.log(results);
	    }
//		sql = 'SELECT * FROM USER';
//		connection.query(sql, function(err, rows, fields){
//				if(rows.length!==0){
//					console.log("DATA: " + rows[0].data.toString());
//				}
//		});
		 
	});
}

function fetchData(callback,userName,password){

	console.log("USERNAME: " + userName + "Password: " + password);
    sql = 'Select * from users where fname="'+userName+'" and pwd="'+password+'"';
		connection.query(sql, function(err, rows, fields){
				if(rows !==0 && rows.length > 0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
				}
				else{
					console.log("Invalid Credentials");
					callback(err, rows);
				}
		});
}

exports.connect = connect;
exports.insertAndQuery = insertAndQuery;
exports.fetchData = fetchData;
exports.getFromCart = getFromCart;
exports.insertLoginTime = insertLoginTime;
exports.insertIntoCart = insertIntoCart;
exports.deleteFromCart = deleteFromCart;
exports.getFromProduct = getFromProduct;
exports.lastCart = lastCart;
exports.deleteall = deleteall;