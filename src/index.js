require("./style.css");

function initChat() {
    const isSpeechSupport = typeof SpeechSynthesisUtterance !== "undefined";
    const isSpeechRecognitionSupport = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recordingClass = "_recording";
    const isRecording = false;
    const systemSendWords = ["отправить", "отправить сообщение", "send", "send message"];
    const form = document.querySelector(".js-chat__form");
    const output = document.querySelector(".js-chat__output");
    const input = form.querySelector(".js-chat__input");
    const rec = form.querySelector(".js-chat__rec");
    const host = location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(host);
    const recognition = isSpeechRecognitionSupport ? createSpeechRecognition() : false;
    const info = getUserInfo();
    addListeners(recognition);

    function createSpeechRecognition() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionEl = new SpeechRecognition();
        recognitionEl.interimResults = true;
        rec.style.display = "inline-block";

        return recognitionEl;
    }

    function getUserInfo() {
        const name = prompt("Enter your name : ", "noname");

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
        const transcript = [].slice.call(e.results)
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
        const data = JSON.parse(e.data);
        const selfClassName = "_self";

        const li = document.createElement('li');
        li.className = "chat__frame " + (info.name === data.name ? selfClassName : "");

        const nameEl = document.createElement('span');
        nameEl.className = "chat__name";
        nameEl.innerText = data.name;
        li.appendChild(nameEl);

        const messageEl = document.createElement('span');
        messageEl.className = "chat__message";
        messageEl.innerText = data.message;
        li.appendChild(messageEl);

        if (isSpeechSupport) {
            const speaker = document.createElement("span");
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
        const speech = new SpeechSynthesisUtterance(msg);
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
        const data = {
            message: input.value,
            name: info.name || "noname"
        }
        ws.send(JSON.stringify(data));
        input.value = "";
    }
}

initChat();