import {InBoxSdkHandler} from "./InBoxSdkHandler";
import {MessageId} from "@shared/types/MessageId";

const inboxHandler = new InBoxSdkHandler();
inboxHandler.load().then(resp => console.log("Inbox Handler Started"));

window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;
});

chrome.runtime.connect().onDisconnect.addListener(function () {
    // clean up when content script gets disconnected
    console.log("***** THE BROWSER DISCONNECTED");
})

const wakeup = () => {
    setTimeout(() => {
        if (!chrome.runtime?.id) {
            console.log("***WARNING** - Couldn't ping since it's disconnected");
        } else {
            const request = {type: MessageId.PING_CtoB, val: "browser ping"};
            chrome.runtime.sendMessage(request, (response) => {
                console.log(response);
            });
        }
        wakeup();
    }, 10000);
}
wakeup();
