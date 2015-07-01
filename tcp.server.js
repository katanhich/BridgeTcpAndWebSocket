var net = require('net');
var config = require('./config');
var StoredSocket = require('./storedsocket');

module.exports = function() {

    var server = net.createServer(function (socket) {
        console.log('TCP CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);

        socket.on('data', function (data) {
            StoredSocket.sendMessage(data);
            socket.write('success!!!');
        });
    });

    server.listen(config.tcp_socket_port, function() {
        console.log('tcp server is listening on ' + config.tcp_socket_port);
    });
};
