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
    $scope.chatName = '';

    // Typed message
    $scope.message = '';

    const chatName = 'Enter Chat Name...';
    const typeMessage = 'Type Message...';

    $scope.hasChatName = false;
    $scope.placeholder = chatName;

    // On submit
    $scope.submit = function() {

        // if first time, enter chatName
        if (!$scope.hasChatName) {
            $scope.hasChatName = true;
            $scope.chatName = $scope.message;
            $scope.placeholder = typeMessage;
            socket.emit('connected', $scope.chatName);
        }
        else if ($scope.hasChatName) {
            socket.emit('chat message', $scope.message);
        }

        $scope.message = '';
        return false;
    };

    // When received message
    socket.on('chat message', function(msg) {
        // console.log('received emit');
        $('#messages').append($('<li>').text(msg));
    });

}]);