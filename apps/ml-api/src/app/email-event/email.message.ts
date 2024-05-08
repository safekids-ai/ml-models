export class EmailMessage {
    public readonly from: EmailContact;
    public readonly to: EmailContact;
    public readonly subject: string;
    public readonly body: string;

    constructor(from: EmailContact, to: EmailContact, subject: string, body: string) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.body = body;
    }
}

export class EmailContact {
    public readonly name: string;
    public readonly email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}
