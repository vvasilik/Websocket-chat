function initChat() {
    recordingClass = "_recording";
    var form = document.querySelector(".js-chat__form");
    var output = document.querySelector(".js-chat__output");
    var input = form.querySelector(".js-chat__input");
    var rec = form.querySelector(".js-chat__rec");
    var host = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);
    var name;

    addListeners();
    getUserInfo();

    function addListeners() {
        rec.addEventListener("click", function() {
            setRecActive();

            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();

            recognition.interimResults = true;
            recognition.addEventListener("result", function(e) {
                var transcript = [].slice.call(e.results)
                    .map(function(result){
                        return result[0];
                    })
                    .map(function(result){
                        return result.transcript;
                    })
                    .join("");

                if (e.results[0].isFinal) {
                    input.value = input.value + transcript + ". ";
                }
            })

            recognition.addEventListener("end", function() {
                setRecInactive();
            });

            recognition.start();
        })
        form.addEventListener("submit", submitMessage);

        input.addEventListener("keydown", function(e) {
            if (e.keyCode === 13) submitMessage(e);
        });

        ws.onmessage = function (event) {
            var data = JSON.parse(event.data);
            var selfClassName = "_self";

            var li = document.createElement('li');
            li.className = "chat__frame " + (name === data.name ? selfClassName : "");

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
        };
    }

    function setRecInactive() {
        rec.disabled = false;
        rec.classList.remove(recordingClass);
    }

    function setRecActive() {
        rec.disabled = true;
        rec.classList.add(recordingClass);
    }

    function submitMessage(e) {
        e.preventDefault();
        var data = {
            message: input.value,
            name: name || "noname"
        }
        ws.send(JSON.stringify(data));
        input.value = "";
    }

    function getUserInfo() {
        name = prompt("Enter your name : ", "noname");
    }
}

initChat();