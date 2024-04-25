import { KIDS_STATUSES } from './KidCard.type';

export const periodTranslateArray: { [key: string]: string } = {
    day: 'Today',
    week: 'This week',
    month: 'This month',
    year: 'This year',
};

export const getStatus = (status?: string) => {
    if (status === KIDS_STATUSES.CONNECTED) return 'connected';
    else if (status === KIDS_STATUSES.NOT_CONNECTED) return 'not connected';
};

export const totalCategoriesCount = (topCategories?: []) => {
    return topCategories?.reduce((accumulator: number, current: { count: number }) => accumulator + current.count, 0);
};
