'use strict';

var ClientWebSocket = {};

module.exports.getUUId = function(data) {
    try {
        var json = JSON.parse(data.toString('utf8'));
        return json.uuid;
    } catch(e) {
        return '';
    }
}

module.exports.remove = function(uuid) {
    delete ClientWebSocket[uuid];
};

module.exports.saveClientWebSocket = function(data, ws) {
    try {
        var uuid = this.getUUId(data);
        ClientWebSocket[uuid] = ws;
    } catch (e) {
        console.log('Data on error: ' + data);
        console.log(e.stack);
    }
}

module.exports.sendMessage = function(data, callback) {
    try {
        var uuid = this.getUUId(data);
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
