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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);

function initChat() {
    var isSpeachSupport = typeof SpeechSynthesisUtterance !== "undefined";
    var isSpeechRecognitionSupport = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recordingClass = "_recording";
    var isRecording = false;
    var systemSendWords = ["отправить", "отправить сообщение", "send", "send message"];
    var form = document.querySelector(".js-chat__form");
    var output = document.querySelector(".js-chat__output");
    var input = form.querySelector(".js-chat__input");
    var rec = form.querySelector(".js-chat__rec");
    var host = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);
    var recognition = isSpeechRecognitionSupport ? createSpeechRecognition() : false;
    var info = getUserInfo();
    addListeners(recognition);

    function createSpeechRecognition() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognitionEl = new SpeechRecognition();
        recognitionEl.interimResults = true;
        rec.style.display = "inline-block";

        return recognitionEl;
    }

    function getUserInfo() {
        var name = prompt("Enter your name : ", "noname");

        return {
            name: name
        }
    }

    function addListeners(recognitionEl) {
        if (recognitionEl) {
            rec.addEventListener("click", function() {
                recButtonAction.call(this, recognitionEl);
            })
            recognitionEl.addEventListener("result", getRecognitionResult);
            recognitionEl.addEventListener("end", setRecInactive);
        }

        form.addEventListener("submit", submitForm);
        input.addEventListener("keydown", keyboardListener);
        ws.addEventListener("message", renderMessage);
    }

    function keyboardListener(e) {
        if (e.keyCode === 13) submitForm(e);
    }

    function recButtonAction(recognitionEl) {
        if (isRecording) {
            setRecInactive();
            recognitionEl.stop();
        } else {
            setRecActive();            
            recognitionEl.start();
        }
    }

    function getRecognitionResult(e) {
        var transcript = [].slice.call(e.results)
            .map(function(result){
                return result[0];
            })
            .map(function(result){
                return result.transcript;
            })
            .join("");

        if (e.results[0].isFinal) {
            if (isSystemWord(transcript)) {
                sendMessage();
            } else {
                input.value = input.value + transcript + ". ";
            }
        }   
    }

    function isSystemWord(word) {
        return systemSendWords.indexOf(word.toLowerCase()) !== -1;
    }

    function renderMessage(e) {
        var data = JSON.parse(e.data);
        var selfClassName = "_self";

        var li = document.createElement('li');
        li.className = "chat__frame " + (info.name === data.name ? selfClassName : "");

        var nameEl = document.createElement('span');
        nameEl.className = "chat__name";
        nameEl.innerText = data.name;
        li.appendChild(nameEl);

        var messageEl = document.createElement('span');
        messageEl.className = "chat__message";
        messageEl.innerText = data.message;
        li.appendChild(messageEl);

        if (isSpeachSupport) {
            var speaker = document.createElement("span");
            speaker.className = "chat__speaker js-chat__speaker";
            speaker.addEventListener("click", function() {
                spellMessage(data.message);
            });
            li.appendChild(speaker);
        }

        document.querySelector('.js-chat__list').appendChild(li);
        output.scrollTop = output.scrollHeight;
    }

    function spellMessage(msg) {
        var speech = new SpeechSynthesisUtterance(msg);
        speechSynthesis.speak(speech);
    }
    
    function setRecInactive() {
        isRecording = false;
        rec.classList.remove(recordingClass);
    };

    function setRecActive() {
        isRecording = true;
        rec.classList.add(recordingClass);
    }

    function submitForm(e) {
        e.preventDefault();
        sendMessage();
    }

    function sendMessage() {
        var data = {
            message: input.value,
            name: info.name || "noname"
        }
        ws.send(JSON.stringify(data));
        input.value = "";
    }
}

initChat();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);