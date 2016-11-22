var connect = require('connect');
var http = require('http');

var guardians = connect();

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
guardians.use(bodyParser.urlencoded({extended: false}));

// respond to all requests
guardians.use(function(req, res){
  res.end('guardians of galaxy!\n');
});

//create node.js http server and listen on port
http.createServer(guardians).listen(3000);