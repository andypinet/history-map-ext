function domSome() {
    var address = "localhost";
    function fireEvent(element,event) {
        if (document.createEvent) {
            // dispatch for firefox + others
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true ); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        } else {
            // dispatch for IE
            var evt = document.createEventObject();
            return element.fireEvent('on'+event,evt)
        }
    }

    var stylesheet = document.createElement('link');
    stylesheet.rel = "stylesheet";
    stylesheet.href = 'https://localhost:4000/index.css';
    stylesheet.onload = function () {
    };
    document.head.appendChild(stylesheet)
    var script = document.createElement('script');
    script.async = false;
    script.src = 'https://localhost:4000/socket.io.js';
    script.onload = function () {
    };
    document.head.appendChild(script);
    var script = document.createElement('script');
    script.async = false;
    script.src = 'https://localhost:4000/bower_components/jquery/dist/jquery.min.js';
    script.onload = function () {
    };
    document.head.appendChild(script);
    var script = document.createElement('script');
    script.async = false;
    script.src = 'https://localhost:4000/bundle.js';
    script.onload = function () {
    };
    document.head.appendChild(script);
    var html5ele = document.querySelector(".bgray-btn:not(.active)");
    if (html5ele) {
        fireEvent(html5ele, "click");
    }
}

domSome();
