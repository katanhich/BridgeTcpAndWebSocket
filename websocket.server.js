'use strict';

var ws_module = require('ws');
var net = require('net');
var StoredSocket = require('./storedsocket');
var config = require('./config');

function initSocketCallbacks(state, ws, tcpSocket) {

    function flushSocketBuffer() {
        if (state.sBuffer.length > 0) {
            tcpSocket.write(Buffer.concat(state.sBuffer));
        }
        state.sBuffer = null;
    };

    function flushWebsocketBuffer() {
        if (state.wsBuffer.length > 0) {
            ws.send(Buffer.concat(state.wsBuffer), {binary: true, mask: false});
        }
        state.wsBuffer = null;
    };

    tcpSocket.on('close', function (had_error) {
        ws.removeAllListeners('close');
        ws.close();
    });

    ws.on('close', function () {
        tcpSocket.removeAllListeners('close');
        tcpSocket.end();
    });

    ws.on('error', function (e) {
        console.log('websocket error');
        console.log(e);
        ws.removeAllListeners('close');
        tcpSocket.removeAllListeners('close');
        ws.close();
        tcpSocket.end();
    });

    tcpSocket.on('error', function (e) {
        console.log('tcp socket error');
        console.log(e);
        ws.removeAllListeners('close');
        tcpSocket.removeAllListeners('close');
        ws.close();
        tcpSocket.end();
    });

    tcpSocket.on('connect', function () {
        state.sReady = true;
        flushSocketBuffer();
    });

    ws.on('open', function () {
        state.wsReady = true;
        flushWebsocketBuffer();
    });

    tcpSocket.on('data', function (data) {
        if (!state.wsReady) {
            state.wsBuffer.push(data);
        } else {
            ws.send(data, {binary: true, mask: false});
        }
    });

    ws.on('message', function (message, flags) {
        StoredSocket.saveClientWebSocket(message, ws);

        if (!state.sReady) {
            state.sBuffer.push(message);
        } else {
            tcpSocket.write(message);
        }
    });
}

module.exports = function () {
    console.log('forwarding web socket port ' + config.web_socket_port + ' to tcp port ' + config.server1_host);

    var wss = new ws_module.Server({port: config.web_socket_port});
    wss.on('connection', function (ws) {
        var tcpSocket = net.connect(config.server1_port, config.server1_host);

        var state = {
            sReady: false,
            wsReady: true,
            wsBuffer: [],
            sBuffer: []
        };
        initSocketCallbacks(state, ws, tcpSocket);
    });
}
