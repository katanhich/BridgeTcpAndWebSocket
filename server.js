'use strict';

var webSocket = require('./websocket.server');
var tcpSocket = require('./tcp.server');

webSocket();
tcpSocket();
