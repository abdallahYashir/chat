var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var LocalStorage = require('node-localstorage').LocalStorage;

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var username = '';
var clients = [];
var messages = [];

var localStorage = new LocalStorage('chat');

// On IO Connection
io.on('connection', function(socket) {

    // Keep track of client socket
    clients.push(socket);

    // User connection
    socket.on('connected', function(msg) {
        io.emit('chat message', msg + ' has connected');
        username = msg;
    });

    // User disconnection
    socket.on('disconnect', function(msg){
        if (msg.username === undefined) {
            io.emit('chat message', username + ' has disconnected');
        }
        else{
            io.emit('chat message', msg.username + ' has disconnected');
        }
        username = '';

        // Remove client
        removeClient(clients, socket);
    });

    // Chat message
    socket.on('chat message', function(msg) {
        var message = msg.username + ': ' + msg.message;
        io.emit('chat message', message);
        messages.push(message);
        updateStorage('messages', messages);
    });

    // Send message only to the newly connected client
    socket.emit('messages', localStorage.getItem('messages'));

}); // end IO Connection

// Server listening on port
http.listen(3000, function() {
    console.log('listening on *:3000');
});

// Function to remove socket from list
function removeClient(clients, socket) {
    var index = clients.indexOf(socket);
    if (index != -1) {
        clients.splice(index, 1);
    }
} // end removeClient

// Update local storage
function updateStorage(key, messages) {
    localStorage.setItem(key, JSON.stringify(messages));
} // end updateStorage