export const getDomain = (url : string) => {
    let hostName = url
    try {
        //to make it URL
        hostName = hostName.indexOf('://') > 0 ? hostName : 'http://' + hostName
        const urlObj: URL = new URL(hostName)
        hostName = urlObj.host
    } catch (e) {
    }
    return hostName
}

function getHostname(url: string) {
    let hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

export function getRootDomain(url: string) {
    let domain = getHostname(url),
    splitArr = domain.split('.'),
    arrLen = splitArr.length;
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
    }
export const getBrowserInfo = () => {
    var ua= navigator.userAgent;
    var tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

export type Language = {
    "id" : string,
    "name" : string,
    "direction" : string
}


