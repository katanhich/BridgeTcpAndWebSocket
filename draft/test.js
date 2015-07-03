/**
 * Created by Cao Hong Phuoc on 7/3/2015.
 */
'use strict';
 
var x = {};

x['1'] = 1;
x['2'] = 2;

console.log(x);

delete x['1'];

try {
    delete x['3'];
} catch(e) {
    console.log(e.stack);
}

console.log(x);