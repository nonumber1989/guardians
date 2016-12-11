var socketIo = require('socket.io')
var socketioJwt = require("socketio-jwt");
var configuration = require('./configurations/configuration');

var io = socketIo(configuration.socketIoPort);

io.of('/chat').on('connection', socketioJwt.authorize({
        secret: 'nonumber1989',
        timeout: 15000 // 15 seconds to send the authentication message
    }))
    .on('authenticated', function(socket) {
        console.log('connected & authenticated: ' + JSON.stringify(socket.decoded_token));
        socket.on('room', function(room) {
            console.log("room ----" + room)
            socket.join(room);
        });

        socket.decoded_token.rooms.forEach(function(room) {
            console.log(room+"---------------nonumber1989-------------------");
             socket.join(room);
        });
    });

// now, it's easy to send a message to just the clients in a given room
room = "abc123";
setInterval(function() {
    io.nsps['/chat'].in(room).emit('message', 'what is going on, party people?');

    io.nsps['/chat'].in('room1').emit('message', 'I was in room one');
    io.nsps['/chat'].in('room2').emit('message', 'i was in room two');
    // this message will NOT go to the client defined above
    io.sockets.in('foobar').emit('message', 'anyone in this room yet?');
}, 5000);

