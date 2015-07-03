'use strict';

var ws_module = require('ws');
var net = require('net');
var StoredSocket = require('./storedsocket');
var config = require('./config');

function initSocketCallbacks(ws) {
    var uuid;

    ws.on('error', function (e) {
        console.log('websocket error');
        console.log(e);
        StoredSocket.remove(uuid);
        ws.removeAllListeners('close');
        ws.close();
    });

    ws.on('close', function() {
        StoredSocket.remove(uuid);
        console.log('Ws is closed with uuid: ' + uuid);
    });

    ws.on('message', function (message) {
        uuid = StoredSocket.getUUId(message);

        StoredSocket.saveClientWebSocket(message, ws);
        tcpConnectToServer1.write(message);
    });
};

var isConnectedToServer1 = false;
var tcpConnectToServer1;
function initConnectToServerOne() {
    tcpConnectToServer1 = net.connect(config.server1_port, config.server1_host);

    tcpConnectToServer1.on('connect', function () {
        isConnectedToServer1 = true;
        console.log('Connect to server1 successfully');
    });

    tcpConnectToServer1.on('data', function (data) {
        //ws.send(data, {binary: true, mask: false});
        StoredSocket.sendMessage(data, function(err) {
            //if (err) {
            //    tcpConnectToServer1.write('Cannot send message to client');
            //} else {
            //    tcpConnectToServer1.write('Send successfully message to client');
            //}

            if (err) {
                console.log('Cannot send message to client');
            } else {
                console.log('Send successfully message to client');
            }
        });
    });

    tcpConnectToServer1.on('close', function (error) {
        isConnectedToServer1 = false;
        console.log('Connection to server1 is closed');
    });

    tcpConnectToServer1.on('error', function (e) {
        console.log('Connection to server1 error');
        console.log(e);
        tcpConnectToServer1.removeAllListeners('close');
        tcpConnectToServer1.end();
        isConnectedToServer1 = false;
    });
}

module.exports = function () {
    console.log('forwarding web socket port ' + config.web_socket_port + ' to tcp port ' + config.server1_host);

    initConnectToServerOne();

    var wss = new ws_module.Server({port: config.web_socket_port});
    wss.on('connection', function (ws) {
        initSocketCallbacks(ws);
    });
}
