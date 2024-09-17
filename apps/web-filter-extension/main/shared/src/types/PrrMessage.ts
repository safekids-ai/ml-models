export type PrrMessages = {
    dir: string;
    alertMessage: string[];
    prr1_screen_greeting: string[];
    prr1_screen_askMessage: string;
    prr1_screen_informMessage: string;
    prr1_screen_informMessageAI: string;
    prr1_screen_informMessageAIContinue: string;
    prr1_screen_continue: string;
    prr1_screen_changedMind: string;
    prr1_screen1_tellMeMore: string;
    prr1_screen2_mistake: string;
    prr1_screen2_letUsKnow: string;
    prr1_feedback_message: string;
    prr1_feedback_thanks: string;
    prr3_weapons_1: string;
    prr3_weapons_2: string;
    prr3_selfHarm_1: string;
    prr3_selfHarm_2: string;
    prr3_selfHarm_3: string;
    prr3_selfHarm_4: string;
    takeMeBack: string;
    iUnderstand: string;
    messageAdult: string;
    backToWork: string;
    prr2Screen1Text1: string;
    prr2Screen1Text2: string;
    PrrLevel2CountDownText1: string;
    PrrLevel2CountDownText2: string;
    prr2LetYourAdultKnow: string;
    chooseATeacherBelow: string;
    send: string;
    explicitContentPart1: string[];
    explicitContentPart2: string[];
    situationalAwarenessPart1: string[];
    situationalAwarenessPart2: string[];
    communicationQuestions: string[];
    questionScreenS: string[];
    questionScreenP: string[];
    questionChoices: string[][];
};

export const defaultMessages: PrrMessages = {
    dir: 'ltr',
    alertMessage: [
        "Your family agreed this wasn't a good thing to do online, right?",
        "This isn't appropriate, is it?",
        "You didn't mean to go here, right?",
        'Whoops! Is that what you meant to do?',
        "Pretty sure you didn't mean to do that, right?",
        'Are you sure you meant to do that?',
        'Would you like to try that again?',
        "Let's try that again, shall we?",
        'Is this the best use of your time?',
        "This isn't where you should be, was it?",
        "Isn't this what you agreed you wouldn't do online?",
        'Is this really the best thing for you to be doing?',
        'This is not the best thing for you to be doing, is it?',
        "Hmm... Is this what you're meant to be looking at?",
        "Hmm... This isn't what you're meant to be looking at, is it?",
        "Whoops! This isn't what you meant to do, right?",
    ],
    prr1_screen_greeting: ['Hello', 'Howdy', 'Hey'],
    prr1_screen_askMessage: "Before you visit this site, we need to ask an adult if it's okay since it's <Category>.",
    prr1_screen_informMessage: 'When you visit sites related to <Category>, we let an adult know.',
    prr1_screen_informMessageAI: 'Our AI thinks this page might be unsafe.',
    prr1_screen_informMessageAIContinue: "If you feel we made a mistake, choose continue and we'll let an adult know.",
    prr1_screen_continue: 'Want to keep going?',
    prr1_screen_changedMind: 'Changed your mind?',
    prr1_screen1_tellMeMore: 'Tell me more',
    prr1_screen2_mistake: 'If you think we made a mistake by intercepting this site,',
    prr1_screen2_letUsKnow: 'let us know.',
    prr1_feedback_message: "We'll take a look at this site to see why we thought it was a problem.",
    prr1_feedback_thanks: 'Thanks for your feedback.',
    prr3_weapons_1: "This doesn't seem like a good site for you to be on.",
    prr3_weapons_2: "Why don't you take a break, and we will let an adult know.",
    prr3_selfHarm_1: 'It is OK to need help.',
    prr3_selfHarm_2: 'Call this number for help',
    prr3_selfHarm_3: 'National Suicide Prevention Lifeline',
    prr3_selfHarm_4: "We'll let an adult know you might need someone to talk to now.",
    takeMeBack: 'Take me back',
    iUnderstand: 'I UNDERSTAND',
    messageAdult: 'Message an adult',
    backToWork: 'Back to safety',
    prr2Screen1Text1: 'It looks like you might be distracted.',
    prr2Screen1Text2: 'I UNDERSTAND',
    PrrLevel2CountDownText1: "After the countdown, let's try again.",
    PrrLevel2CountDownText2: "Let's go back. We can try again.",
    prr2LetYourAdultKnow: "Thanks, we'll let an adult know.",
    chooseATeacherBelow: 'Please pick a teacher',
    send: 'Send',
    explicitContentPart1: ["It's normal to want to learn about grown up stuff.", "It's natural to want to learn about adult things."],
    explicitContentPart2: [
        'Did you know that this is not a good way to learn about being a grown up?',
        'Did you know that stuff like this is often made by hurting women and children?',
    ],
    situationalAwarenessPart1: [
        "We all end up clicking on things we shouldn't.",
        'Once in a while, we make a mistake.',
        "Sometimes we click on something we shouldn't.",
    ],
    situationalAwarenessPart2: [
        'Did you know that taking a few deep breaths can help you make better choices?',
        'Did you know that taking a little break can help you make better choices?',
        'Did you know that doing 10 jumping jacks can help calm your mind?',
        'Did you know that spending less time in front of a screen may help you sleep better?',
        'Did you know that too many distractions during the day can make it hard to sleep?',
    ],
    communicationQuestions: [
        "Let's try setting a goal for being online. <br> <span class='choose-one-or-more'>Choose one or more of the following:</span>",
        'That sounds good. <br> <br> If you reached this goal, how would you feel?',
        'If you did this, what would happen?',
        "You are doing well! Keep going! <br> <br> What's in the way of your reaching this goal?",
    ],
    questionScreenS: ["What's getting in your way of staying on track?", 'What do you want to do about it?'],
    questionScreenP: ['What else do you want to tell your parent?'],
    questionChoices: [
        ['Spend more time outside', 'Spend less time in front of a screen', 'Not get in trouble', 'Rest my brain', 'Stay focused on school work'],
        ['Proud of myself', 'Confident', 'Happy and good', 'Energized', 'Excited'],
        [
            'I would get praise from people who matter to me',
            'I would do better in school',
            'I would sleep better',
            'I would get more freedom at home',
            'I would not get in trouble',
        ],
        ['I want to play online right now', "I don't want to do school work right now", "I'm tired", 'I want to play with my friends right now', "I'm bored"],
    ],
};
