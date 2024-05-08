export const removeHttp = (url) => {
    return url.replace(/^https?:\/\//, '');
};

export const getSimpleURL = (url) => {
    let withoutHttp = url.replace(/^https?:\/\//, '');
    return withoutHttp.replace(/^www./, '');
};

export const extractQueryString = (urlString: string) => {
    const url = new URL(urlString);
    return url.search;
};
