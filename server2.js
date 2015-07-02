var net = require('net');
var config = require('./config');

var client = new net.Socket();
client.connect(config.tcp_socket_port, '127.0.0.1', function () {
    var data = {uuid: 'sdsd', return: '15:04:33'};
    console.log('send ' + JSON.stringify(data))
    client.write(JSON.stringify(data));
});

client.on('data', function (data) {
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
});

client.on('close', function () {
    console.log('Connection closed');
});
