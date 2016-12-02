var http = require('http');
var socketIo = require('socket.io')
var fs = require('fs');
var namespaces = require('./configurations/configuration');

//create http server 
var server = http.createServer(function(req, res) {
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

var io = socketIo(server);
io.use(socketioJwt.authorize({
  secret: 'nonumber1989',
  handshake: true
}));
// handle incoming connections from clients
io.of('/chat').on('connection', function(socket) {
    console.log('hello! ', socket.decoded_token.name);
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
