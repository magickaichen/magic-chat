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
    let nameInput = $('#nickname');

    // self user (the current client user)
    let selfUser = null;
    let currentUsers = null;

    // dynamically create an audio element
    let audioElement = document.createElement('audio');

    nameForm.submit(function () {
        let name = $('#nickname');
        if (name.val()) {
            selfUser = new User(name.val());
            socket.emit('new user', selfUser);
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

    // successfully connected
    socket.on('connect success', function () {
        //hide name input form on successful connect
        nameForm.parent().css('display', 'none');
    });

    // duplicate username
    socket.on('id exists', function (name) {
        nameInput.addClass("uk-form-danger");
        UIkit.notification({
            message: 'Boomer! Nickname '+ name +' Already Exists!',
            status: 'danger',
            pos: 'top-center',
            timeout: 2000
        });
    });

    socket.on('invalid id length', function (length) {
        nameInput.addClass("uk-form-warning");
        if (length < 3) {
            UIkit.notification({
                message: 'C\'mon, Get a Longer Name!',
                status: 'warning',
                pos: 'top-center',
                timeout: 2000
            });
        }
        else {
            UIkit.notification({
                message: 'Your Name Is Too Long!',
                status: 'warning',
                pos: 'top-center',
                timeout: 2000
            });
        }
    });

    socket.on('new user connect', function (user) {
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

function UpdateList(usersObj) {
    let userList = $('#users-list').empty();
    let userCountDiv = $('#users-count-div');
    let onlineUserCnt = Object.keys(usersObj).length;
    console.log(usersObj);
    for (let key of Object.keys(usersObj)) {
        let user = usersObj[key];
        userList.append($('<li>').text(user.username));
    }
    // update online user count
    userCountDiv.children('p').text('Online Users: ' + onlineUserCnt);
}