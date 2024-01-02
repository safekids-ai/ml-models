import {EventType} from "./events.types";
import {EmailMessage} from "./EmailMessage";

export class EmailEvent {

    constructor(public readonly eventType: EventType, public readonly email: EmailMessage) {
    }
}
