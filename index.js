var host = location.origin.replace(/^http/, 'ws')
    var ws = new WebSocket(host);
    ws.onmessage = function (event) {
        var li = document.createElement('li');
        li.className = "chat__frame";
        li.innerHTML = event.data;
        document.querySelector('.js-chat__output').appendChild(li);
    };

    var form = document.querySelector(".js-chat__form");
    var input = form.querySelector(".js-chat__input");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        ws.send(input.value);
    })