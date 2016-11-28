var connect = require('connect');
var http = require('http');
var socketIo = require('socket.io')
var fs = require('fs');
var namespaces = require('./configurations/configuration');
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

// handle incoming connections from clients
io.of('/chat').on('connection', function(socket) {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('room', function(room) {
        console.log("room ----" + room)
        socket.join(room);
    });
});

// now, it's easy to send a message to just the clients in a given room
room = "abc123";
setInterval(function() {
    io.nsps['/chat'].in(room).emit('message', 'what is going on, party people?');
    // this message will NOT go to the client defined above
    io.sockets.in('foobar').emit('message', 'anyone in this room yet?');
}, 5000);

server.listen(3000);
