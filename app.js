var socket = io();

$('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg) {
    console.log('received emit');
    $('#messages').append($('<li>').text(msg));
});

// Angular
/**
* socketChat Modul;
*
* Description
*/
angular.module('socketChat', []);

angular.module('socketChat').controller('socketCtrl', ['$scope', function($scope){
    
}]);