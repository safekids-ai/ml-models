export const activityTime = (value: string): Date => {
    const today = new Date();
    switch (value) {
        case 'week':
            const previousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            previousWeek.setHours(0, 0, 0, 0);
            return previousWeek;
        
        case 'day':

            console.log("'day''day''day''day''day''day''day''day''day''day''day''day''day''day''day''day''day'")
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            console.log({yesterday})
            return yesterday;
        case 'month':
            const month = new Date().getMonth();
            const previousMonth = new Date(today.setMonth(month - 1));
            previousMonth.setHours(0, 0, 0, 0);
            return previousMonth;
        case 'year':
            const year = new Date().getFullYear();
            const previousYear = new Date(today.setFullYear(year - 1));
            previousYear.setHours(0, 0, 0, 0);
            return previousYear;
        default:
            const defaultWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            defaultWeek.setHours(0, 0, 0, 0);
            return defaultWeek;
    }
};