'use strict';

var WebSocketServer = require('ws').Server;
var net = require('net');
var StoredSocket = require('./storedsocket');
var config = require('./config');
var parseData = require('./parse-data');

function initSocketCallbacks(state, ws, tcpSocket) {

    function flushSocketBuffer() {
        // send each messgae in array
        while(state.sData.length) {
            var message = state.sData.shift();
            tcpSocket.write(message);
        }
    };

    function closeWebSocket() {
        ws.removeAllListeners('close');
        ws.close();
        StoredSocket.remove(state.uuid);
    };

    function closeTcpSocket() {
        tcpSocket.removeAllListeners('close');
        tcpSocket.end();
        StoredSocket.remove(state.uuid);
    };

    function closeSockets() {
        closeWebSocket();
        closeTcpSocket();
    };

    tcpSocket.on('close', function() {
        closeWebSocket();
    });

    ws.on('close', function () {
        closeTcpSocket();
    });

    tcpSocket.on('error', function (e) {
        console.log('tcp socket error on  client: ' + state.uuid);
        console.log(e);
        closeSockets();
    });

    ws.on('error', function (e) {
        console.log('web socket error on client: ' + state.uuid);
        console.log(e);
        closeSockets();
    });

    tcpSocket.on('connect', function() {
        state.sReady = true;
        flushSocketBuffer();
    });

    tcpSocket.on('data', function(data) {
        ws.send(data, {binary: true, mask: false});
    });

    ws.on('message', function(message) {
        state.uuid = parseData.getUUId(message);
        StoredSocket.saveClientWebSocket(message, ws);

        var query = parseData.getQuery(message);
        if (query) {
            if (state.sReady) {
                tcpSocket.write(query);
            } else {
                state.sData.push(query);
            }
        }
    });
};

module.exports = function() {
    console.log('forwarding web socket port ' + config.web_socket_port + ' to tcp port ' + config.server1_host);

    var wss = new WebSocketServer({host: config.web_socket_host, port: config.web_socket_port});
    wss.on('connection', function (ws) {
        var state = {
            sReady: false, // tcp socket is ready or not
            sData: [], // buffer for tcpSocket
            uuid: ''
        };
        var tcpSocket = net.connect(config.server1_port, config.server1_host);
        initSocketCallbacks(state, ws, tcpSocket);
    });
};
