var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var username = 'unknown_user';

// On IO Connection
io.on('connection', function(socket) {

    // User connection
    socket.on('connected', function(msg) {
        io.emit('chat message', msg + ' has connected');
        username = msg;
    });

    // User disconnection
    socket.on('disconnect', function(){
        io.emit('chat message', username + ' has disconnected');
    });

    // Chat message
    socket.on('chat message', function(msg) {
        io.emit('chat message', username + ': ' + msg);
    });

}); // end IO Connection

// Server listening on port
http.listen(3000, function() {
    console.log('listening on *:3000');
});