var LOCAL_RELOAD_SOCKET_PORT = 8081;
var LOCAL_RELOAD_SOCKET_URL = "ws://localhost:".concat(LOCAL_RELOAD_SOCKET_PORT);

var MessageInterpreter = /** @class */ (function () {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function MessageInterpreter() {
    }
    MessageInterpreter.send = function (message) {
        return JSON.stringify(message);
    };
    MessageInterpreter.receive = function (serializedMessage) {
        return JSON.parse(serializedMessage);
    };
    return MessageInterpreter;
}());

var needToUpdate = false;
function initReloadClient(_a) {
    var watchPath = _a.watchPath, onUpdate = _a.onUpdate, onForceReload = _a.onForceReload;
    var socket = new WebSocket(LOCAL_RELOAD_SOCKET_URL);
    function sendUpdateCompleteMessage() {
        socket.send(MessageInterpreter.send({ type: 'done_update' }));
    }
    socket.addEventListener('message', function (event) {
        var message = MessageInterpreter.receive(String(event.data));
        switch (message.type) {
            case 'do_update': {
                if (needToUpdate) {
                    sendUpdateCompleteMessage();
                    needToUpdate = false;
                    onUpdate();
                }
                return;
            }
            case 'wait_update': {
                if (!needToUpdate) {
                    needToUpdate = message.path.includes(watchPath);
                }
                return;
            }
            case 'force_reload': {
                onForceReload === null || onForceReload === void 0 ? void 0 : onForceReload();
                return;
            }
        }
    });
    socket.onclose = function () {
        console.log("Reload server disconnected.\nPlease check if the WebSocket server is running properly on ".concat(LOCAL_RELOAD_SOCKET_URL, ". This feature detects changes in the code and helps the browser to reload the extension or refresh the current tab."));
        setTimeout(function () {
            initReloadClient({ watchPath: watchPath, onUpdate: onUpdate });
        }, 1000);
    };
    return socket;
}

function addHmrIntoView(watchPath) {
    var pendingReload = false;
    initReloadClient({
        watchPath: watchPath,
        onUpdate: function () {
            // disable reload when tab is hidden
            if (document.hidden) {
                pendingReload = true;
                return;
            }
            reload();
        },
    });
    // reload
    function reload() {
        pendingReload = false;
        window.location.reload();
    }
    // reload when tab is visible
    function reloadWhenTabIsVisible() {
        !document.hidden && pendingReload && reload();
    }
    document.addEventListener('visibilitychange', reloadWhenTabIsVisible);
}

export { addHmrIntoView as default };
