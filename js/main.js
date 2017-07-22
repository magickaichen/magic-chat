/**
 * Created by alonso134 on 5/21/2017.
 * Client Side JavaScript (ES6)
 */

/**
 * Loading CSS (Webpack)
 */
import '../css/main.css';
import '../css/uikit.css';
import '../css/uikit-rtl.css';


/**
 * Handling incoming message
 */
$(document).ready(function () {
    // Initialize Socket.io instance
    let socket = io();
    let nameForm = $('#nickname-form');
    let msgForm = $('#send-form');
    let msgDiv = $('#messages-div');

    // self user (the current client user)
    let selfUser = null;
    let currentUsers = [];

    // dynamically create an audio element
    let audioElement = document.createElement('audio');




    nameForm.submit(function () {
        let name = $('#nickname');
        if (name.val()) {
            selfUser = new User(name.val());
            socket.emit('new user', selfUser);
            nameForm.parent().css('display', 'none');
        }
        return false;
    });

    msgForm.submit(function() {
        let message = $('#m');
        if (message.val()) {
            // emits chat message to server
            socket.emit('chat message', message.val());
            // clears chat box message after submit
            message.val('');
        }
        // preventDefault
        return false;
    });

    socket.on('user connect', function (user) {
        $('#messages').append($('<li>').append('<p>' + user.username +' Connected</p>'));
        currentUsers = user.users;
        UpdateList(currentUsers);
        audioElement.setAttribute('src', 'audio/user-login.mp3');
        audioElement.play();
    });
    socket.on('chat message', function (msg) {
        let listHtml = '<span class="uk-label">' + cleanInput(msg.username) + '</span>'
            + '<p>' + cleanInput(msg.message) + '</p>';

        $('#messages').append($('<li>').append(listHtml));
        // play notification sound
        audioElement.setAttribute('src', 'audio/new-msg.mp3');
        audioElement.play();
        // scroll to bottom animation
        msgDiv.animate({
            scrollTop: msgDiv.prop("scrollHeight")
        }, 200);
    });
    socket.on('disconnect', function (user) {
        $('#messages').append($('<li>').text(user.username + ' Disconnected'));
        currentUsers = user.users;
        UpdateList(currentUsers);
        audioElement.setAttribute('src', 'audio/user-disconnected.mp3');
        audioElement.play();
    });
});

function User(username) {
    this.username = username;
    this.tagId = null;
}

User.prototype = {
    get fullUsername() {
        if (!!this.tagId){
            return this.username + '#' + this.tagId;
        }
        else {
            return this.username;
        }
    }
};

function cleanInput(input) {
    return $('<div/>').text(input).text();
}

function UpdateList(userArray) {
    let userList = $('#users-list').empty();
    let userCountDiv = $('#users-count-div');
    let onlineUserCnt = userArray.length;
    for (let user of userArray) {
        userList.append($('<li>').text(user.username));
    }
    // update online user count
    userCountDiv.children('p').text('Online Users: ' + onlineUserCnt);
}