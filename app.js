// Angular
/**
 * socketChat Module;
 *
 * Description
 */
angular.module('socketChat', []);

angular.module('socketChat').controller('socketCtrl', ['$scope', function($scope) {

    // Declare socket io
    var socket = io();

    // Chat name
    $scope.username = '';

    // Typed message
    $scope.message = '';

    var chatName = 'Enter User Name...';
    var typeMessage = 'Type Message...';

    var typing = false;
    var timeout = null;

    $scope.hasUserName = false;
    $scope.placeholder = chatName;

    // Store username in local storage
    if (localStorage.getItem('chat.username')) {
        $scope.username = localStorage.getItem('chat.username');
        $scope.hasUserName = true;
        $scope.placeholder = typeMessage;
    }

    // On submit
    $scope.submit = function() {

        // if first time, enter chatName
        if (!$scope.hasUserName) {

            $scope.hasUserName = true;
            $scope.username = $scope.message;

            $scope.placeholder = typeMessage;
            localStorage.setItem('chat.username', $scope.username);

            socket.emit('connected', $scope.username);
        } else if ($scope.hasUserName) {
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
        socket.emit('disconnect', { username: $scope.username });
    };

    // Received all previous messages in the group chat
    socket.on('messages', function(msg) {
        // if message is not empty and user has entered user name
        if (msg !== null && msg !== '') {

            // Parse string to array
            msg = JSON.parse(msg);

            if (msg.length > 0) {
                msg.forEach(function(message) {
                    $('#messages').append($('<li>').text(message));
                });
            }
        }
    }); // en socket.on messages

    // Detect user typing on and shows
    // show typing no longer 
    function timeoutFunction() {
        typing = false;
        socket.emit('typingStop', {username: $scope.username});
    }

    // Emits typing whenever user types a key
    $scope.onKeyDownNotEnter = function(keyEvent) {
        // if Enter key is pressed, launch timeout directly
        if (keyEvent.keyCode === 13) {
            timeoutFunction();
            // $('.' + $scope.username).remove();
            typing = false;
            return;
        }
        // if typing false
        if (!typing) {
            typing = true;
            socket.emit('typing', {username: $scope.username});
            timeout = setTimeout(timeoutFunction, 5000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 5000);
        }
    };

    // On user typing
    socket.on('is typing', function(msg) {
        if (msg !== '' && msg !== $scope.username) {
            $('#whoIsTyping').append($('<li class="' + msg + '">').text(msg + ' is typing...'));
        }
        
    });

    // On user stop typing
    socket.on('stop typing', function(msg) {
        $('.' + msg).remove();
    });

}]);
