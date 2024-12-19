import {EventType} from "@shared/types/events.types";
import {EmailMessage} from "@shared/types/EmailMessage";

export class EmailEvent {

    constructor(public readonly eventType: EventType, public readonly email: EmailMessage) {
    }
}
