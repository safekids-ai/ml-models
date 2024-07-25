import { CategoryStatus } from '@src/shared/types/CategoryStatus';
import { PrrCategory } from '@src/shared/types/PrrCategory';

interface QuestionInterface {
    questionHeadings?: string;
    choiceParagraph?: string;
    categoryId?: string;
}

const gamingQuestion: QuestionInterface = {
    questionHeadings: `If you're going to play games on this device is that something we should...`,
    choiceParagraph: 'Choose just one. ',
    categoryId: PrrCategory.ONLINE_GAMING,
};

const socialMediaQuestion: QuestionInterface = {
    questionHeadings: `If you're going to go to social media sites on this device, should we...`,
    choiceParagraph: 'Remember, just choose one.',
    categoryId: PrrCategory.SOCIAL_MEDIA_CHAT,
};

let totalQuestions: Array<QuestionInterface> = [gamingQuestion, socialMediaQuestion];

const answerChoices = [
    { name: 'Always allow', value: CategoryStatus.ALLOW },
    { name: 'Let an adult know', value: CategoryStatus.INFORM },
    { name: 'Ask an adult for access', value: CategoryStatus.ASK },
    { name: 'Never allow', value: CategoryStatus.PREVENT },
];

const timeDuration = [
    { type: '30 minutes', value: '30min' },
    { type: '60 minutes', value: '60min' },
    { type: '90 minutes', value: '90min' },
    { type: '120 minutes', value: '1200min' },
];

export { totalQuestions, answerChoices, timeDuration };
