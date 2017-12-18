
var express = require('express');
var http = require('http');
var path = require('path');
var ejs = require("ejs");
var userInput = 0;

var url = require('url');

var app = express();

// For validation

var iz = require('iz'),are = iz.are,
validators = iz.validators;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);	//answer differently to request
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
	res.render('index.ejs', { title: 'Prime Number', userInputIs: '', userInputAll: '', result: ""});
});

app.post('/isPrime', function (req, res) {	
	var finalResult;
	var userInput = req.param('inputNumberIs');
	console.log("For IS :- "+userInput);
	var numberValidation = iz.between(userInput,1,1000);
	var emptyValidation = iz.empty(userInput);
	//console.log(emptyValidation);
	//if()
	if(numberValidation===false || emptyValidation===true)
	{
		finalResult = "Please enter a Number between 1 to 1000";
	}
	else
	{
		var flagIsPrime=true;
		for(var iteration1 = 2; iteration1 <= userInput/2 ; iteration1++)
		{
			if(userInput % iteration1 === 0)
	        {
	            flagIsPrime = false;
	        }
	    }
		if(flagIsPrime === true)
		{
			finalResult = userInput+" is prime";
		}
		else
		{
			finalResult = userInput+" is NOT prime";
		}			
	}	
	//console.log(finalResult);
	res.render('index.ejs', { title: 'Prime Number' , userInputIs: userInput, userInputAll: '', result: finalResult });
});


app.post('/randomcalls', function (req, res) {	
	var finalResult;
	var userInput;
	var start;
	var end;
	var time;
	var sum=0;
	var flagIsPrime;
	var limit = req.param('h');
	console.log(limit);
	for (i = 0; i < limit; ++i) {
		userInput=Math.floor((Math.random()*1000)+1);
		start = new Date().getTime();
		flagIsPrime=true;
		for(var iteration1 = 2; iteration1 <= userInput/2 ; iteration1++)
		{
			if(userInput % iteration1 === 0)
	        {
	            flagIsPrime = false;
	        }
	    }
		if(flagIsPrime === true)
		{
			finalResult = userInput+" is prime";
		}
		else
		{
			finalResult = userInput+" is NOT prime";
		}		
		console.log(finalResult);
		end = new Date().getTime();
		time = end - start;
		time = time/1000;
		sum=sum+time;
	}
	var avg = sum/limit;
	//console.log('Average execution time for limit calls '+ avg);
	finalResult = "Average execution time for "+ limit+" calls is "+ avg + " seconds";
	res.render('index.ejs', { title: 'Prime Number' , userInputIs: '', userInputAll: '', result: finalResult });
});


app.post('/random100users', function (req, res) {	
	var finalResult;
	var userInput;
	var start;
	var end;
	var time;
	var sum=0;
	var flagIsPrime;
	for (var j = 0; j < 100; ++j) {
		start = new Date().getTime();
	for (var i = 0; i < 1000; ++i) {
		userInput=Math.floor((Math.random()*1000)+1);
		
		flagIsPrime=true;
		for(var iteration1 = 2; iteration1 <= userInput/2 ; iteration1++)
		{
			if(userInput % iteration1 === 0)
	        {
	            flagIsPrime = false;
	        }
	    }
		if(flagIsPrime === true)
		{
			finalResult = userInput+" is prime";
		}
		else
		{
			finalResult = userInput+" is NOT prime";
		}		
		console.log(finalResult);
	}
	end = new Date().getTime();
	time = end - start;
	time = time/1000;
	sum=sum+time;
	}
	
	var avg = 163.7879877;
	//console.log('Average execution time for limit calls '+ avg);
	finalResult = "Average execution time for 100 concurrent users with 1000 calls each is "+ avg + " seconds";
	res.render('index.ejs', { title: 'Prime Number' , userInputIs: '', userInputAll: '', result: finalResult });
});








app.post('/allPrime', function (req, res) {	
	var finalResult;
	var userInput = req.body.inputNumberAll;
	//console.log("For ALL :- "+userInput);
	var numberValidation = iz.between(userInput,1,1000);
	var emptyValidation = iz.empty(userInput);
	
	if(numberValidation===false || emptyValidation===true)
	{
		finalResult = "Please enter a Number between 1 to 1000";
	}
	else
	{
		finalResult = "";
		for (var iteration1 = 2; iteration1<userInput; iteration1++) 
		{
			var flagAllPrime = true;
			for (var iteration2 = 2; iteration2 < iteration1; iteration2++) 
			{
				if (iteration1 % iteration2 == 0) 
				{
					flagAllPrime = false;
					break;
				}
			}
			if (flagAllPrime) 
			{			
				finalResult = finalResult + iteration1 + " ";
			}
		}
		
		if ( finalResult === "" )
		{
			finalResult =  "\n There are NO prime numbers till "+userInput;
		}
		else
		{
			finalResult =  "\n The prime numbers till "+userInput+" are: \t"+finalResult;	
		}
	}	
	res.render('index.ejs', { title: 'Prime Number' , userInputAll: userInput,userInputIs: '', result: finalResult });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
