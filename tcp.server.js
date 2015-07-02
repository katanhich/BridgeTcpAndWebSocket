var net = require('net');
var config = require('./config');
var StoredSocket = require('./storedsocket');

module.exports = function() {

    var server = net.createServer(function (socket) {
        console.log('TCP CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);

        socket.on('data', function (data) {
            StoredSocket.sendMessage(data, function(err) {
                if (err) {
                    socket.write('send fail: ' + err.message);
                } else {
                    socket.write('send success!!!');
                }
            });
        });

        socket.on('close', function (err) {
            console.log('TCP connection from server2 is closed')
        });
    });

    server.listen(config.tcp_socket_port, function() {
        console.log('tcp server is listening on ' + config.tcp_socket_port);
    });
};
