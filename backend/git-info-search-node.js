var mysql = require('mysql');
const http = require('http');
const hostname = 'localhost';
const port = 3001;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dobby"
});
const server = http.createServer((req, res) => {
	if (req.url == '/saveRegistrationDetail') {
		console.log("saveRegistrationDetail");
		var body = '';
		req.on('data', function (data) {
			body += data;
		});
		req.on('end', function () {
			var resValues = JSON.parse(body);
			var sql = "INSERT INTO dobbytable (name, password, email) VALUES ("+"'"+resValues.name+"'"+","+"'"+resValues.pass+"'"+","+"'"+resValues.email+"'"+")";
			con.query(sql, function (err, result) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				//res.setHeader("Access-Control-Allow-Origin", "*");
				if (err){
					res.end(JSON.stringify({response:'Registered Failed'}));
					throw err;
				}
				res.end(JSON.stringify({response:'Registered Successfully'}));
			});
		});
	} else if (req.url == '/handleLoginPage') {
		console.log("handleLoginPage");
		var body = '';
		req.on('data', function (data) {
			body += data;
		});
		req.on('end', function () {
			var resValues = JSON.parse(body);
			var sql = "SELECT * from  dobbytable WHERE email="+"'"+resValues.username+"'"
			+" AND password = "+"'"+resValues.userpass+"'";
			console.log(sql);
			con.query(sql, function (err, result) {
				console.log("No of Record: "+result.length);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
			/*	res.setHeader('Accept', 'application/json',);
				res.setHeader('Access-Control-Allow-Methods', 'POST',);
				res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');*/
				if (err){
					res.end(JSON.stringify({response:'Logged In Failed!'}));
					
				}
				if(result.length>0){
					res.end(JSON.stringify({response:'success'}));
				 } else {
					res.end(JSON.stringify({response:'Username or Password is wrong!'}));
				 }
			});
		});
	} else if (req.url == '/testnode') {
		res.setHeader('Content-Type', 'application/json');
		//res.setHeader("Access-Control-Allow-Origin", "*");
		res.end("Hi I am active.");
		
	}else {
		res.statusCode = 500;
		res.setHeader('Content-Type', 'text/plain');
		res.end('Invalid');
	}
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
