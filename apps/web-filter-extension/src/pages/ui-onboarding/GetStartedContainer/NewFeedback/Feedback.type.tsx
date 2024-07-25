export type Props = {
    onboardingFeedbackComplete: () => void;
    currentOnboardingStep?: number;
};

export type OnboardingFeedbackQuestionAnswerSet = {
    query: string;
    responses: string[];
};
