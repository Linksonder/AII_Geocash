const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/map.png', (req, res) => {
    res.sendFile(__dirname + '/map.png');
  });

io.on('connection', (socket) => {
    socket.payload = {};
    users.push(socket);

    socket.emit('init', users.map(u => u.payload));

    socket.on('set username', (username) => {
        socket.payload.username = username;
    })

    socket.on('set pin', (loc) => {
        socket.payload.x = loc.x;
        socket.payload.y = loc.y;
        console.log('sending updates to clients');
        io.emit('set pins', users.map(u => u.payload));
    });

    socket.on('disconnect', () => {
        var index = users.indexOf(socket);
        users.splice(index, 1);
        console.log('removing ' + index);
    });
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});