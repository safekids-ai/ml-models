import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { clearTimeout } from 'timers';

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

function debounce(callback, delay) {
    var timer;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timer);
        timer = setTimeout(function () { return callback.apply(void 0, args); }, delay);
    };
}

var clientsThatNeedToUpdate = new Set();
var needToForceReload = false;
function initReloadServer() {
    var wss = new WebSocketServer({ port: LOCAL_RELOAD_SOCKET_PORT });
    wss.on('listening', function () { return console.log("[HRS] Server listening at ".concat(LOCAL_RELOAD_SOCKET_URL)); });
    wss.on('connection', function (ws) {
        clientsThatNeedToUpdate.add(ws);
        ws.addEventListener('close', function () { return clientsThatNeedToUpdate.delete(ws); });
        ws.addEventListener('message', function (event) {
            if (typeof event.data !== 'string')
                return;
            var message = MessageInterpreter.receive(event.data);
            if (message.type === 'done_update') {
                ws.close();
            }
            if (message.type === 'build_complete') {
                clientsThatNeedToUpdate.forEach(function (ws) { return ws.send(MessageInterpreter.send({ type: 'do_update' })); });
                if (needToForceReload) {
                    needToForceReload = false;
                    clientsThatNeedToUpdate.forEach(function (ws) {
                        return ws.send(MessageInterpreter.send({ type: 'force_reload' }));
                    });
                }
            }
        });
    });
}
/** CHECK:: src file was updated **/
var debounceSrc = debounce(function (path) {
    // Normalize path on Windows
    var pathConverted = path.replace(/\\/g, '/');
    clientsThatNeedToUpdate.forEach(function (ws) {
        return ws.send(MessageInterpreter.send({ type: 'wait_update', path: pathConverted }));
    });
}, 100);
chokidar.watch('src', { ignorePermissionErrors: true }).on('all', function (_, path) { return debounceSrc(path); });
/** CHECK:: manifest.js was updated **/
chokidar.watch('manifest.js', { ignorePermissionErrors: true }).on('all', function () {
    needToForceReload = true;
});
initReloadServer();
