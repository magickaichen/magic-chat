/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_main_css__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_main_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_main_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_uikit_css__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_uikit_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_uikit_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_uikit_rtl_css__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_uikit_rtl_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__css_uikit_rtl_css__);
/**
 * Created by alonso134 on 5/21/2017.
 * Client Side JavaScript (ES6)
 */

/**
 * Loading CSS (Webpack)
 */





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
        $('#messages').append($('<li>').text(user.username +' Connected'));
        currentUsers = user.users;
        generateUserListView(currentUsers);
        audioElement.setAttribute('src', 'audio/user-login.mp3');
        audioElement.play();
    });
    socket.on('chat message', function (msg) {
        let listHtml = '<span class="uk-label">' + cleanInput(msg.username) + '</span>'
            + '  ' + cleanInput(msg.message);

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
        generateUserListView(currentUsers);
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

function generateUserListView(userArray) {
    let userList = $('#users-list').empty();
    for (let user of userArray) {
        userList.append($('<li>').text(user.username));
    }
}

/***/ })
/******/ ]);