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
var currentUsers = {};

io.on('connection', function (socket) {

    socket.on('new user', function (user) {
        var id = user.username.toLowerCase();
        if (currentUsers.hasOwnProperty(id)) {
            io.to(socket.id).emit('id exists', user.username);
        }
        else if (id.length < 3 || id.length > 10) {
            io.to(socket.id).emit('invalid id length', id.length);
        }
        else {
            currentUsers[id] = user;
            socket.user = user;
            io.to(socket.id).emit('connect success');
            io.emit('new user connect', {
                username: socket.user.username,
                users: currentUsers
            });
        }
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', {
            username: socket.user.username,
            message: msg
        });
    });
    socket.on('disconnect', function () {
        //check if valid user exists on disconnection
        if(socket.user) {
            var id = socket.user.username.toLowerCase();
            console.log(currentUsers);
            if (currentUsers.hasOwnProperty(id)) {
                delete currentUsers[id];
                io.emit('disconnect', {
                    username: socket.user.username,
                    users: currentUsers
                });
            }
        }
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});