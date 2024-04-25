export class EmailContentDTO {
    Subject: string;
    Body: string;
    Text?: string;
}

export class EmailTemplateDTO {
    _id: string;
    name: string;
    content: EmailContentDTO;
}
