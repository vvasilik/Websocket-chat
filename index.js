function initChat() {
    var recordingClass = "_recording";
    var isRecording = false;
    var systemSendWords = ["отправить", "отправить сообщение", "send", "send message"];
    var form = document.querySelector(".js-chat__form");
    var output = document.querySelector(".js-chat__output");
    var input = form.querySelector(".js-chat__input");
    var rec = form.querySelector(".js-chat__rec");
    var host = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);
    var recognition = createSpeechRecognition();
    var info = getUserInfo();
    addListeners(recognition);

    function createSpeechRecognition() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognitionEl = new SpeechRecognition();
        recognitionEl.interimResults = true;

        return recognitionEl;
    }

    function getUserInfo() {
        var name = prompt("Enter your name : ", "noname");

        return {
            name: name
        }
    }

    function addListeners(recognitionEl) {
        rec.addEventListener("click", function() {
            recButtonAction.call(this, recognitionEl);
        })
        recognitionEl.addEventListener("result", getRecognitionResult);
        recognitionEl.addEventListener("end", setRecInactive);
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

        var messageEl = document.createElement('span');
        messageEl.className = "chat__message";
        messageEl.innerText = data.message;

        li.appendChild(nameEl);
        li.appendChild(messageEl);

        document.querySelector('.js-chat__list').appendChild(li);
        output.scrollTop = output.scrollHeight;
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