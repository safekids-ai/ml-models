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

export const isRootURL = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname === '/';
  } catch (error) {
    return false;
  }
}
export const hasQueryParams = (url: string) => {
  const urlObject = new URL(url);
  return urlObject.searchParams.toString() !== '';
}
