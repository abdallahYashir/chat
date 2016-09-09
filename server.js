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
var clientUsernameMap = new Map(); // socket.id, username

var localStorage = new LocalStorage('chat');

// On IO Connection
io.on('connection', function(socket) {

    // Keep track of client socket
    clients.push(socket);

    // User connection
    socket.on('connected', function(msg) {
        io.emit('chat message', msg + ' has connected');
        username = msg;
        if (msg !== '') {
            addNewClientUsername(socket.id, msg);
        }
    });

    // User disconnection
    socket.on('disconnect', function(msg){

        // compared with socket.id
        var _userName = getUsernameBySocketId(socket.id);
        if (_userName !== undefined || _userName !== null) {
            io.emit('chat message', _userName + ' has disconnected');
            removeClientUsername(socket.id);
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

    // Show User Typing
    socket.on('typing', function(msg) {
        io.emit('is typing', msg.username);
    });

    socket.on('typingStop', function(msg) {
        io.emit('stop typing', msg.username);
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

// Add new client username
function addNewClientUsername(id, username) {
    clientUsernameMap.set(id, username);
} // end addNewClientUsername

// Get username 
function getUsernameBySocketId(socketId) {
    return clientUsernameMap.get(socketId);
} // end getUsernameBySocketId

// Remove client username
function removeClientUsername(socketId) {
    clientUsernameMap.delete(socketId);
}