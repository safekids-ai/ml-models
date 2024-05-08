import { getRequest } from '../../../../utils/api';
import { GET_DOWNLOAD_ACTIVITY, GET_SEARCH_AUTOCOMPLETE, GET_SEARCH_STUDENTS } from '../../../../utils/endpoints';
import { AutoCompleteOption, Column, StudentSearchData, StudentSearchResult } from './SearchPage.type';
import { startCase } from 'lodash';
import { format } from 'date-fns';

const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getAutoCompleteOptions = (keyword: string) => {
    return getRequest<{}, AutoCompleteOption[]>(
        `${GET_SEARCH_AUTOCOMPLETE}`,
        {},
        {
            params: {
                keyword,
            },
        }
    );
};

export const getSearchResult = (keyword: string, page: number) => {
    const timezone = getTimeZone();
    return getRequest<{}, StudentSearchResult>(
        `${GET_SEARCH_STUDENTS}`,
        {},
        {
            params: {
                keyword,
                page,
                timezone,
            },
        }
    );
};

export const exportSearchResult = (keyword: string) => {
    const timezone = getTimeZone();
    return getRequest<{}, BlobPart>(
        `${GET_DOWNLOAD_ACTIVITY}`,
        {},
        {
            params: {
                keyword,
                timezone,
            },
        }
    );
};

const getDate = (date?: string) => {
    if (!date) return '';
    const result = format(new Date(date), 'LLLL dd, yyyy');
    return result;
};
export const generateColumns = (data: StudentSearchData): Column[] => {
    const keys = Object.keys(data);
    return keys.map((key) => ({
        id: key,
        label: startCase(key),
        minWidth: 170,
        align: key === 'urlAttempted' ? 'right' : 'left',
        format: key === 'interceptionDate' ? (val) => getDate(val.toString()) : undefined,
    }));
};
