var connect = require('connect');
var http = require('http');
var socketIo = require('socket.io')
var fs = require('fs');

var guardians = connect();

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
guardians.use(bodyParser.urlencoded({ extended: false }));

// respond to all requests
guardians.use(function(req, res) {
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
});

//create http server 
var server = http.createServer(guardians);
var io = socketIo(server);


var chat = io.of('/chat').on('connection', function(socket) {
    socket.emit('chatMessage', {'fromChat':"here is a message form chat !"});
    socket.on('chatEvent', function(data) {
        console.log("chat event ----"+data);
    });
});

var news = io.of('/news').on('connection', function(socket) {
    socket.emit('newsMessage', { 'fronNews': 'here is a message from news !' });
    socket.on('newsEvent', function(data) {
        console.log("news event ----"+data);
    });
});


server.listen(3000);