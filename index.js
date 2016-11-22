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

//create http server 
var server  = http.createServer(guardians);
var io = require('socket.io')(server);
io.on('connection', function(client){
  client.on('event', function(data){});
  client.on('disconnect', function(){});
});
server.listen(3000);