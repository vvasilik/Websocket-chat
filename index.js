function initChat() {
    var form = document.querySelector(".js-chat__form");
    var output = document.querySelector(".js-chat__output");
    var input = form.querySelector(".js-chat__input");
    var host = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);
    var name;

    addListeners();
    getUserInfo();

    function addListeners() {

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