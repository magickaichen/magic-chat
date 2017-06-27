/**
 * Created by Mike Xiao on 5/5/2017.
 * Server side Socket.io JavaScript (ES5.1)
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// All Users
var currentUsers = [];

io.on('connection', function (socket) {

    socket.on('new user', function (user) {
        currentUsers.push(user);
        socket.user = user;
        io.emit('user connect', {
            username: socket.user.username,
            users: currentUsers
        });
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', {
            username: socket.user.username,
            message: msg
        });
    });
    socket.on('disconnect', function () {
        var userIdx = currentUsers.indexOf(socket.user);
        currentUsers.splice(userIdx, 1);
        io.emit('disconnect', {
            username: socket.user.username,
            users: currentUsers
        });
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});