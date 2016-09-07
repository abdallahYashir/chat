var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// On IO Connection
io.on('connection', function(socket) {

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

});

// Server listening on port
http.listen(3000, function() {
    console.log('listening on *:3000');
});