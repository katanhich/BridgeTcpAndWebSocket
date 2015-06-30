var net = require('net');

var client = new net.Socket();
client.connect(3000, '127.0.0.1', function() {
	console.log('Connected to server');
	var data = {uuid:'phuoc', query:'ask_time'};
  console.log('send ' + JSON.stringify(data))
	client.write(JSON.stringify(data));
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
