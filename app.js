// Angular
/**
* socketChat Module;
*
* Description
*/
angular.module('socketChat', []);

angular.module('socketChat').controller('socketCtrl', ['$scope', function($scope){

    // Declare socket io
    var socket = io();

    // Chat name
    $scope.username = '';

    // Typed message
    $scope.message = '';

    var chatName = 'Enter User Name...';
    var typeMessage = 'Type Message...';

    $scope.hasUserName = false;
    $scope.placeholder = chatName;

    // On submit
    $scope.submit = function() {

        // if first time, enter chatName
        if (!$scope.hasUserName) {
            $scope.hasUserName = true;
            $scope.username = $scope.message;
            $scope.placeholder = typeMessage;
            socket.emit('connected', $scope.username);
        }
        else if ($scope.hasUserName) {
            socket.emit('chat message', {
                username: $scope.username,
                message: $scope.message
            });
        }

        $scope.message = '';
        return false;
    };

    // When received message
    socket.on('chat message', function(msg) {
        // console.log('received emit');
        $('#messages').append($('<li>').text(msg));
    });

    // Detect when tab/window is going to close
    window.onbeforeunload = function() {
        socket.emit('disconnect', {username: $scope.username});
    };

    // Received all previous messages in the group chat
    socket.on('messages', function(msg) {
        // if message is not empty and user has entered user name
        if (msg.length > 0) {
            msg.forEach(function(message) {
                $('#messages').append($('<li>').text(message));
            });
        }
    }); // en socket.on messages

}]);