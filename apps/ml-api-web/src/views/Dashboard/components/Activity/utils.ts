import { dissoc, sortBy, prop, pluck, contains, propEq, find, reduce, pathOr } from 'ramda';
import { customProperties } from '../../../../theme';
import { isNothing, isSomething } from '../../../../utils/helpers';
import { format, startOfDay } from 'date-fns';
import { EventsAPIResponse, EventsData, GetEventsResponse } from './types';
// import moment from "moment";

export const ONE_MINUTE = 60 * 1000;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const IMAGE_CAPTURE_INTERVAL = 30000;
export const zoomDomainDetails = [
    { duration: ONE_HOUR, label: 'Last 1 Hour' },
    {
        duration: 6 * ONE_HOUR,
        label: '6 Hours',
    },
    {
        duration: 12 * ONE_HOUR,
        label: '12 Hours',
    },
    {
        duration: ONE_DAY,
        label: 'Day',
    },
    {
        duration: 7 * ONE_DAY,
        label: 'Week',
    },
    {
        duration: 30 * ONE_DAY,
        label: 'Month',
    },
];
export const zoomDomains = pluck('duration', zoomDomainDetails);
export type Category = {
    label: string;
    title: string;
    color: string;
};
export const categories: Category[] = [
    {
        label: 'ADULT',
        title: 'Adult Content',
        color: customProperties.colors.red,
    },
    // {
    //   label: "VIOLENT",
    //   title: "Violent Content",
    //   color: "blue",
    // },
];

export const transformData = (rawData: EventsAPIResponse, timePerBar: number) => {
    const offset = '+00:00'; // getTimezoneOffset();
    const timestamps: number[] = [];
    const sortedRawData = sortBy((d) => -1 * parseInt(d._id), rawData);
    const data = sortedRawData.reduce((result: EventsData[], datum, index) => {
        const { event } = datum;
        // const { maxY: y, maxBox } = reduce(
        //   (result: any, item: any) => {
        //     if (item.score > result.maxY) {
        //       result.maxY = item.score;
        //       result.maxBox = item;
        //     }
        //     return result;
        //   },
        //   {
        //     maxY: 0,
        //     maxBox: pathOr([], ["eventDetail", "preds", 0], event),
        //   },
        //   pathOr([], ["eventDetail", "preds"], event)
        // );
        const y = event.score;
        const actualTimestamp = formatDate(event.date, event.timezone || offset).getTime();
        let x = actualTimestamp;
        let duplicate = false;
        const time = Math.max(IMAGE_CAPTURE_INTERVAL, timePerBar * 1000);
        let x2 = actualTimestamp - startOfDay(actualTimestamp).getTime();
        const diff = x2 % time;
        x = diff >= time / 2 ? x + (time - diff) : x - diff;
        // }
        if (contains(x, timestamps)) {
            const duplicatedData = find<any>(propEq('x', x), result);

            if (duplicatedData?.actualTimestamp < actualTimestamp) {
                x += timePerBar * 1000;
            } else x -= timePerBar * 1000;
            if (contains(x, timestamps)) {
                duplicate = true;
            }
        } else timestamps.push(x);
        const obj = {
            ...event,
            ...dissoc<any>('label', datum),
            x,
            y: y > 0 ? y : 0.5,
            timestamp: x,
            actualTimestamp,
            category: isSomething(event.label) && event.label.length > 0 ? event.label[0] : event.isSafe === false ? 'ADULT' : undefined,
            // box: maxBox.box,
            // videoAvailable: datum.videoAvailable,
            image: event.imageThumbnailUrl,
            label: undefined,
            // imageBlurredUrl: event.imageBlurredUrl,
            // feedbackProvided: event.feedbackProvided,
        };
        if (!duplicate) result.push(obj);
        return result;
    }, []);
    return sortBy(prop('timestamp'), data);
};
export const transformRawData = (rawData: GetEventsResponse, timePerBar: number) => {
    const offset = '+00:00'; // getTimezoneOffset();
    const sortedRawData = rawData; //sortBy((d) => -1 * parseInt(d._id), rawData);
    const data = sortedRawData.reduce((result: EventsData[], datum, index) => {
        // const { event } = datum;
        const { maxY: y } = reduce(
            (result: any, item: any) => {
                if (item.score > result.maxY) {
                    result.maxY = item.score;
                    result.maxBox = item;
                }
                return result;
            },
            {
                maxY: 0,
            },
            pathOr([], ['eventDetail', 'preds'], datum)
        );
        const actualTimestamp = formatDate(datum.date, datum.timezone || offset).getTime();
        let x = actualTimestamp;
        const time = IMAGE_CAPTURE_INTERVAL; // timePerBar * 1000;
        let x2 = actualTimestamp - startOfDay(actualTimestamp).getTime();
        const diff = x2 % time;
        x = diff >= time / 2 ? x + (time - diff) : x - diff;
        // }
        // if (contains(x, timestamps)) {
        //   const duplicatedData = find<any>(propEq("x", x), result);

        //   if (duplicatedData?.actualTimestamp < actualTimestamp) {
        //     x += timePerBar * 1000;
        //   } else x -= timePerBar * 1000;
        // } else timestamps.push(x);
        const obj = {
            ...dissoc<any>('label', datum),
            x,
            y: y > 0 ? y : 0.5,
            timestamp: x,
            actualTimestamp,
            category: isSomething(datum.label) && datum.label.length > 0 ? datum.label[0] : datum.isSafe === false ? 'ADULT' : undefined,
            // box: maxBox.box,
            // videoAvailable: datum.videoAvailable,
            image: datum.imageThumbnailUrl,
            label: undefined,
            // imageBlurredUrl: event.imageBlurredUrl,
            // feedbackProvided: event.feedbackProvided,
        };
        result.push(obj);
        return result;
    }, []);
    return sortBy(prop('timestamp'), data);
};
export const extractDataSummary = (data: any[], duration: number) => {
    if (isNothing(data)) return [];
    const result = [];
    let currentData = data[0];
    let maxValue = data[0].y;
    let maxValueItem = data[0];
    let minTimestamp = data[0].timestamp;
    let videoLink: string | undefined;
    let groupedEvents = [data[0]];
    for (let i = 1; i < data.length; i++) {
        if (data[i].timestamp - currentData.timestamp < duration) {
            groupedEvents.push(data[i]);
            if (maxValue < data[i].y) {
                maxValue = data[i].y;
                maxValueItem = data[i];
            }

            if (data[i].videoAvailable && data[i].video_link) videoLink = data[i].video_link;
            if (i === data.length - 1) {
                const timestamp = duration === IMAGE_CAPTURE_INTERVAL ? minTimestamp : minTimestamp + duration / 2;
                const timePerBar = IMAGE_CAPTURE_INTERVAL; //p duration / (width ? Math.ceil(width / 4) : 180);
                const r = timestamp % timePerBar;
                const newTime = (r >= timePerBar / 2 ? timestamp + (timePerBar - r) : timestamp - r) - (duration !== IMAGE_CAPTURE_INTERVAL ? duration / 2 : 0);
                result.push({
                    ...currentData,
                    ...maxValueItem,
                    y: maxValue,
                    timestamp: newTime,
                    category: maxValueItem.category,
                    x: newTime,
                    image: maxValueItem.imageThumbnailUrl || maxValueItem.imageUrl,
                    ...(videoLink || maxValueItem.video_link ? { video: videoLink || maxValueItem.video_link } : {}),
                });
                groupedEvents = [data[i]];
            }
        } else {
            const timestamp = duration === IMAGE_CAPTURE_INTERVAL ? minTimestamp : minTimestamp + duration / 2;
            const timePerBar = duration; /// 180;
            const r = timestamp % timePerBar;
            const newTime = (r >= timePerBar / 2 ? timestamp + (timePerBar - r) : timestamp - r) - (duration !== IMAGE_CAPTURE_INTERVAL ? duration / 2 : 0);
            const obj = {
                ...currentData,
                ...maxValueItem,
                y: maxValue,
                timestamp: newTime,
                x: newTime,
                category: maxValueItem.category,
                image: maxValueItem.imageThumbnailUrl || maxValueItem.imageUrl,
                ...(videoLink || maxValueItem.video_link ? { video: videoLink || maxValueItem.video_link } : {}),
            };
            result.push(obj);

            groupedEvents = [data[i]];
            currentData = data[i];
            maxValue = currentData.y;
            minTimestamp = currentData.timestamp;
            videoLink = undefined;
            maxValueItem = currentData;
        }
    }
    return result;
};
export const getBaseData = (timestamp: number, imagesPerBar: number, totalTime: number = ONE_DAY) => {
    const data = [];
    const numberOfBars = totalTime / IMAGE_CAPTURE_INTERVAL;
    for (let i = 0; i < numberOfBars; i += imagesPerBar) {
        data.push({
            x: timestamp + i * IMAGE_CAPTURE_INTERVAL,
            y: 1,
            date: '',
            imageBlurredUrl: '',
            feedbackProvided: false,
            imageThumbnailUrl: '',
            eventId: '',
            score: 1,
            objectName: '',
            timezone: '+00:00',
            maxScore: 1,
            maxUnsafeScore: 1,
            _id: '',
            timestamp: 0,
            actualTimestamp: 0,
            category: '',
            videoAvailable: false,
            image: '',
            label: undefined,
        });
    }
    return data;
};

export const getStroke = (props: any) => {
    return props.index % 2 === 0 ? 'blue' : 'transparent';
};

export const getTickCount = (zoomDomain: number) => {
    switch (zoomDomains[zoomDomain]) {
        case ONE_HOUR:
            return 2;
        case 6 * ONE_HOUR:
            return 24;
        case 12 * ONE_HOUR:
            return 12;
        case ONE_DAY:
            return 8;
        case 7 * ONE_DAY:
            return 7;
        default:
            return 8;
    }
};
export const getTickValues = (startTime: number, totalTime: number, zoomDomain: number) => {
    const tickCount = getTickCount(zoomDomain);
    const ticks = [startTime];
    for (let i = 1; i <= tickCount; i++) {
        ticks.push(startTime + i * Math.ceil(totalTime / tickCount));
    }
    return ticks;
};

const getDayString = (timeStamp: number) => {
    const t = new Date(timeStamp);
    return [format(t, 'dd/MM'), format(t, 'EEE')];
};
const getTimeString = (timeStamp: number) => {
    return [format(timeStamp, 'hh:mm aa')];
};
export const getFormattedTickValues = (timestamp: number, zoomDomain: number, index: number, totalCount: number) => {
    const duration = zoomDomains[zoomDomain];
    if (zoomDomain === 0) return getTimeString(timestamp);
    else if (duration > ONE_DAY) return getDayString(timestamp);
    else if (duration <= ONE_DAY) {
        if (index === 0 || index === totalCount - 1) return getDayString(timestamp);
        else return getTimeString(timestamp);
    } else {
        return getTimeString(timestamp);
    }
};

export const getTimezoneOffset = () => {
    let offset = -1 * new Date().getTimezoneOffset(); //moment(date).utcOffset();
    const result = offset > 0 ? '+' : '-';
    offset = Math.abs(offset);
    const hours = Math.floor(offset / 60);
    const hoursStr = hours < 10 ? `0${hours}` : hours;
    const minutes = offset % 60;
    const minutesStr = minutes === 0 ? '00' : minutes < 10 ? `0${minutes}` : minutes;
    return result + hoursStr + ':' + minutesStr;
};

// const getOffsetInMinutes = (offset: string = "+07:00") => {
//   const time = offset.substring(1).split(":");
//   const difference = parseInt(time[0]) * 60 + parseInt(time[1]);
//   return (offset[0] === "-" ? -1 : 1) * difference;
// };

export const formatDate = (dateStr: string = '2020-11-21T10:08:31Z', offset: string = '-10:00') => {
    const timestamp = new Date(dateStr);
    return timestamp; //new Date(result);
};
export const TOTAL_CHART_MARGIN = 91;

export const parseText = (text: string) => {
    const div = document?.createElement('div');
    div.innerHTML = text;
    return div?.innerText || text;
};
