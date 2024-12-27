import {Inject, Injectable} from '@nestjs/common';
import type {EmailInterface} from './email.interfaces';

export abstract class EmailService {
  abstract sendEmail(email: EmailInterface): Promise<void>;
}
