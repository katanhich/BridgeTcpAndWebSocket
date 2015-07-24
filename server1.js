'use strict';

var net = require('net');
var config = require('./config');

function responseTime(uuid) {
    var reponse = {
        uuid: uuid,
        return: new Date().toString()
    };
    return JSON.stringify(reponse);
}

function reponseError(uuid, err) {
    var reponse = {
        uuid: uuid,
        return: err
    };
    return JSON.stringify(reponse);
}

var server = net.createServer(function (socket) {

    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);

    socket.on('data', function (data) {
        // try {
        //     var json = JSON.parse(data.toString('utf8'));
        //     console.log('Received data: ' + data.toString());
        //     if (json.query === 'ask_time') {
        //         socket.write(responseTime(json.uuid));
        //     } else {
        //         socket.write(reponseError(json.uuid, 'Wrong query'));
        //     }
        // } catch (e) {
        //     console.log('Data on error: ' + data);
        //     console.log(e.stack);
        //     socket.write(reponseError('server error'));
        // }
    });

    socket.on('error', function(err) {
        console.log('socket error');
    });

    socket.on('close', function() {
        console.log('socket is closed');
    });
});

server.listen(config.server1_port, function () {
    console.log('server is listening on ' + config.server1_port);
});
