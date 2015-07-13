/**
 * Created by Cao Hong Phuoc on 7/14/2015.
 */
'use strict';

module.exports.getUUId = function(data) {
    try {
        var json = JSON.parse(data.toString('utf8'));
        return json.uuid;
    } catch(e) {
        return '';
    }
};

module.exports.getQuery = function(data) {
    try {
        var json = JSON.parse(data.toString('utf8'));
        return json.query;
    } catch(e) {
        return '';
    }
};