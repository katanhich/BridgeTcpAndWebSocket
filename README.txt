// install wscat
npm install wscat

// all config about host and port in config.js

// start bridge server: it will start web socket and tcp server
node server

// start server1 
node server1

// client connect to bridge 
wscat -c ws://localhost:8080 -p 8
and send
{"uuid": "phuoc", "query": "ask_time"}

// start server2: it will send {uuid: 'phuoc', return: '15:04:33'} to tcp server of bridge
client will receive {uuid: 'phuoc', return: '15:04:33'}
