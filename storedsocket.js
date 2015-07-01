'use strict';

var ClientWebSocket = {};

function getUUId(data) {
    var json = JSON.parse(data.toString('utf8'));
    return json.uuid;
}

module.exports.saveClientWebSocket = function(data, ws) {
    try {
        var uuid = getUUId(data);
        ClientWebSocket.uuid = ws;
    } catch (e) {
        console.log(e.stack);
    }
}

module.exports.sendMessage = function (data) {
    try {
        var uuid = getUUId(data);
        var socket = ClientWebSocket.uuid;
        if (socket && data.length > 0) {
            socket.send(data);
            data = null;
        }
    } catch (e) {
        console.log(e.stack);
    }
}
