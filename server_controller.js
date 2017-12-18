var application_root = __dirname,
    express = require("express"),
    path = require("path"),
	ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");

var title = 'EJS template with Node.JS';
var data = 'Data from node';

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

global.uname="";
global.pwd="";

app.get('/login', function (req, res) {
	ejs.renderFile('login.ejs',
			{title : title, data : data},
			function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
});

app.get('/signup', function (req, res) {
	ejs.renderFile('signup.ejs',
			{title : title, data : data},
			function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
});


app.post('/signup', function (req, res) {
	if(!req.body.hasOwnProperty('fname') ||!req.body.hasOwnProperty('pwd')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	//var fname=req.body.fname.toString();
	//var lname=req.body.lname.toString();
	//var email=req.body.email.toString();
	//var pwd=req.body.pwd.toString();

	mysql.insertAndQuery(req.param('fname'),req.param('lname'),req.param('email'),req.param('pwd'));
		ejs.renderFile('signupOK.ejs',{name: req.param('fname')},
				function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		}
				);
		res.end("SignupOK");
});



app.post('/validate', function (req, res) {
	if(!req.body.hasOwnProperty('userName') ||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}else if(results.length === 0){
			res.end('Invalid Credentials.. Please login with valid credentials <br><br> <a href="http://localhost:3000/login"> Click here to go back to login page !</a>');
		}
		else{
			mysql.getFromProduct(function(err,posts){
				if(err){
					throw err;
				}
			
			ejs.renderFile('result.ejs',
					{name : results[0].fname, llogin: results[0].llogin, posts: posts},
					function(err, result) {
				// render on success
				if (!err) {
					global.uname=req.param('userName');
					global.pwd=req.param('password');
					mysql.insertLoginTime(function(err,results){
						if(err){
							throw err;
						}},results[0].fname,results[0].pwd);
					console.log('Login time updated');
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
			});
		}
	},req.param('userName'),req.param('password'));
	
});


app.post('/continue', function (req, res) {
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			mysql.getFromProduct(function(err,posts){
				if(err){
					throw err;
				}
			
			ejs.renderFile('result.ejs',
					{name : results[0].fname, llogin: results[0].llogin,posts:posts},
					function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
			});
		}
	},global.uname,global.pwd);	
});








/*change*/

/*function getPosts(cb) {
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'pass',
	  port: '3306',
	  database: 'test'
	});
	 
	connection.connect();
  var sql = 'SELECT * FROM users';
  connection.query(sql, function (err, result) {
    if (err) return cb(err);
    cb(null, result);
  });
}*/




//show table
//app.all('/', function (req, res) {
app.post('/cart', function (req, res) {
  mysql.getFromCart(function (err, posts) {
    if (err) return res.json(err);
    ejs.renderFile('cart.ejs', {posts: posts},
    		function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	}		
    );
  });
});

app.post('/last', function (req, res) {
	  mysql.lastCart(function (err, posts) {
	    if (err) return res.json(err);
	    ejs.renderFile('last.ejs', {posts: posts},
	    		function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		}		
	    );
	  });
	});



app.post('/updatecart', function (req, res) {
	//var posts=req.body.c1;
	//console.log(' postsDATA: '+ posts);
	console.log(req.param('c1')+req.param('c2')+req.param('c3')+req.param('c4'));
	 mysql.insertIntoCart(req.param('c1'),req.param('c2'),req.param('c3'),req.param('c4'),function (err, posts) {
	    if (err) return res.json(err);
	    ejs.renderFile('cart.ejs', {posts: posts},
	    		function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		}		
	    );
	  });
	});


app.post('/deletefromcart', function (req, res) {
	 mysql.deleteFromCart(req.param('c1'),function (err, posts) {
	    if (err) return res.json(err);
	    ejs.renderFile('cart.ejs', {posts: posts},
	    		function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		}		
	    );
	  });
	});


app.post('/checkout', function (req, res) {
	var sum=req.param('sum');
	ejs.renderFile('checkout.ejs',
			{sum:sum},
			function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
});

app.post('/signout', function (req, res) {
	global.uname="";
	global.pwd="";
	mysql.deleteall(function (err, posts) {
		    if (err) return res.json(err);
	ejs.renderFile('signout.ejs',
			{},
			function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}		
		});
	});
});



// upload file
app.post('/upload', function (req, res) {
  fs.readFile(req.files.file.path, 'utf8', function (err, data) {
    if (err) return res.json(err);
    // split file into array of non-empty Strings
    var posts = data.split(/\r\n?|\n/).filter(isNotEmpty);
    
    // insert posts into mysql db
    addPosts(posts, function (err, result) {
      if (err) return res.json(err);
      var msg = 'Added ' + result.affectedRows + ' rows.';

      // display all posts
      getPosts(function (err, posts) {
        if (err) return res.json(err);
        res.render('index.html', {posts: posts, msg: msg});
      });
    });
  });
});

// clear table
app.get('/delete', function (req, res) {
  deletePosts(function (err, result) {
    if (err) return res.json(err);
    var msg = 'Deleted ' + result.affectedRows + ' rows.';
    res.render('index.html', {msg: msg});
  });
});

// start server
//http.createServer(app).listen(app.get('port'), function () {
  //console.log('Express server listening at http://' + host + ':' + port);
//});

//function createTable() {
  //var sql = 'CREATE TABLE IF NOT EXISTS posts ('
    //        + 'id INTEGER PRIMARY KEY AUTO_INCREMENT,'
      //      + 'text text'
        //  + ');'; 
 // db.query(sql, function (err, result) {
   // if (err) console.log(err);
 // });
//}



function addPosts(posts, cb) {
  var sql = 'INSERT INTO posts (text) VALUES ?';
  
  var values = posts.map(function (post) {
    return [post];
  });
  
  db.query(sql, [values], function (err, result) {
    if (err) return cb(err);
    cb(null, result);
  });
}



function isNotEmpty(str) {
  return str && str.trim().length > 0;
}

/*change*/



















app.listen(3000);