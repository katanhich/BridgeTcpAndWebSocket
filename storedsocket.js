'use strict';

var parseData = require('./parse-data');

var ClientWebSocket = {};

module.exports.remove = function(uuid) {
    delete ClientWebSocket[uuid];
};

module.exports.saveClientWebSocket = function(data, ws) {
    try {
        var uuid = parseData.getUUId(data);
        ClientWebSocket[uuid] = ws;
    } catch (e) {
        console.log('Data on error: ' + data);
        console.log(e.stack);
    }
}

module.exports.sendMessage = function(data, callback) {
    try {
        var uuid = parseData.getUUId(data);
        var socket = ClientWebSocket[uuid];
        if (socket && data.length > 0) {
            socket.send(data);
            data = null;
            callback();
        } else {
            callback(new Error('Cannot find uuid'));
        }
    } catch (e) {
        console.log('Data on error: ' + data);
        console.log(e.stack);
        callback(e);
    }
}
