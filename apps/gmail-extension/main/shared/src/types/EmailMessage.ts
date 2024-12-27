export class EmailMessage {
    constructor(public readonly from: EmailContact | null,
                public readonly to: EmailContact | null,
                public readonly subject: string,
                public readonly body: string | null,
                public readonly threadId?: string | null,
                public readonly messageId?: string | null) {
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
