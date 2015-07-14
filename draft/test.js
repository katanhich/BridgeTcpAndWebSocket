/**
 * Created by Cao Hong Phuoc on 7/3/2015.
 */
'use strict';

var sBuffer = [];
sBuffer.push('1');
sBuffer.push('2');
sBuffer.push('3');
sBuffer.push('4');
sBuffer.push('5');

console.log(sBuffer)

while(sBuffer.length) {
    var b = sBuffer.shift()
    console.log(b);
}

sBuffer.push('6');
console.log(sBuffer)