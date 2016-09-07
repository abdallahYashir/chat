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

    // Typed message
    $scope.message = '';

    // On submit
    $scope.submit = function() {
        socket.emit('chat message', $scope.message);
        $scope.message = '';
        return false;
    };

    // When received message
    socket.on('chat message', function(msg) {
        // console.log('received emit');
        $('#messages').append($('<li>').text(msg));
    });

}]);