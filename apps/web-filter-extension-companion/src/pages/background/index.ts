/* istanbul ignore file */
import { PrimaryExtensionMediator } from '@src/pages/background/mediator';
import { EmailService } from '@src/pages/background/notifier';

const primaryExt = new PrimaryExtensionMediator();
primaryExt.initializeExtensionEventListeners();

const emailService = new EmailService();
primaryExt.attach(emailService);
