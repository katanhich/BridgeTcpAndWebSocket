var net = require('net');
 
var server = net.createServer(function(socket) {

  console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);

  socket.on('data', function(data) {
    var json = JSON.parse(data.toString('utf-8'));
    console.log('Data: ' + data.toString('utf-8'));
    console.log(json)
    console.log(json.query)
    if (json.query === 'ask_time') {
      var time = new Date();
      socket.write(time.toString());
    } else {
      socket.write('Wrong query');
    }
  });

  socket.on('close', function() {
      console.log('CLOSED: ');
   });
  
});

var port = 3000;
server.listen(3000, function() { 
  console.log('server is listening on ' +  3000);
});