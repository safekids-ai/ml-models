import { uniqBy } from 'lodash';
import { validateWebsite } from '../../../../../utils/validations';
import { IFilteredWebsites, IUrls } from '../website.types';
import { getBaseDomain } from '../../../../../utils/helpers';

const removeUrlDuplicates = (newAddedUrls: IUrls[], oldUrls: IUrls[]): IUrls[] => {
    const uniqueInputUrls = uniqBy(newAddedUrls, p => p.name.trim().toLowerCase());
    return uniqueInputUrls.reduce((finalUrls: IUrls[], currentUrl: IUrls) => {
        const duplicate = oldUrls.some((url) => url.name.trim().toLowerCase() === currentUrl.name.trim().toLowerCase());
        if (!duplicate) finalUrls.push(currentUrl);
        return finalUrls;
    }, []);
};

const filterDuplicates = (newAddedUrls: IUrls[], oldUrls: IUrls[]): IUrls[] => {
    let newUrls: IUrls[] = [...newAddedUrls, ...oldUrls];
    let finalUrls: IUrls[] = [];
    const removeUrls = (name: string) => newUrls.filter((nUrl) => nUrl.name.trim().toLowerCase() !== name.trim().toLowerCase());
    const getDuplicateUrls = (name: string) => newUrls.filter((nUrl) => nUrl.name.trim().toLowerCase() === name.trim().toLowerCase());
    const getDuplicateUrlsWithId = (name: string) => newUrls.filter((nUrl) => nUrl.name.trim().toLowerCase() === name.trim().toLowerCase() && nUrl.hasOwnProperty('id'));
    const getValidUrls = (fUrl: IUrls[]) => fUrl.filter((nUrl) => nUrl.isInvalid === false);
    const getInvalidUrls = (fUrl: IUrls[]) => fUrl.filter((nUrl) => nUrl.isInvalid === true);
    const getPredefinedUrls = (fUrl: IUrls[]) => fUrl.filter((nUrl) => !nUrl.hasOwnProperty('isInvalid'));

    while (newUrls.length > 0) {
        /**
         *  newUrls array contains both newly added URLs and old urls.
         *  Here we check whether the first element of newUrl has duplicates in the array or not.
         *  If it has duplicates, we only add a single entry into final array and imbed the isInvalid bit for color green/red.
         *  After that we remove duplicate URLs from the array newURLs, and the loop will continue until the array is empty.
         *  */
        let selectedUrl = { ...newUrls[0] };

        let duplicates = getDuplicateUrlsWithId(selectedUrl.name); //getDuplicateUrls(selectedUrl.name);
        if (duplicates.length > 0) {
            const newSelectedUrl = { ...duplicates[0] };
            newUrls = removeUrls(newSelectedUrl.name);
            finalUrls.push(newSelectedUrl);
        } else {
            duplicates = getDuplicateUrls(selectedUrl.name);
            if (duplicates.length > 1) selectedUrl['isInvalid'] = !!validateWebsite(selectedUrl.name);
            newUrls = removeUrls(selectedUrl.name);
            finalUrls.push(selectedUrl);
        }
    }
    /**
     *  Here we are combining the end result in an order, on the basis of:
     *  First the list will contain invalid URLs
     *  After that list will contain valid URLs
     *  At the end the list will contain predefined URLs that arent inserted again by user.
     */
    finalUrls = [...getInvalidUrls(finalUrls), ...getValidUrls(finalUrls), ...getPredefinedUrls(finalUrls)];
    return finalUrls;
};

const addUrls = (urls: string, selectedKidId: string, websites: IFilteredWebsites[]) => {
    const urlsStringArray = urls.split(',');
    const filteredUrls: IUrls[] = [];
    const filteredNewUrls = urlsStringArray.reduce((finalUrls: IUrls[], currentUrl: string) => {
        if (!finalUrls.some((url) => url.name === currentUrl)) {
            if (!validateWebsite(currentUrl.trim()))
                filteredUrls.push({
                    name: getBaseDomain(currentUrl.trim()) || '',
                    enabled: true,
                });
            finalUrls.push({
                name: getBaseDomain(currentUrl.trim()) || '',
                enabled: true,
                isInvalid: !!validateWebsite(currentUrl.trim()),
            });
        }
        return finalUrls;
    }, []);

    const kidWebsites = websites.find((kid: IFilteredWebsites) => kid.id === selectedKidId);
    const urlsToAdd = removeUrlDuplicates(filteredUrls, kidWebsites?.urls || []);
    let nonFilteredUrlsNew = filterDuplicates(filteredNewUrls, kidWebsites?.urls || []);
    return {
        id: kidWebsites?.id,
        name: kidWebsites?.name,
        urlsToAdd,
        nonFilteredUrls: nonFilteredUrlsNew,
    };
};

const removeUrlItem = (selectedKidId: string, urlToRemoveName: string, websites: IFilteredWebsites[]) => {
    const finalWebsiteslocal = websites.reduce((finalWebsites: IFilteredWebsites[], currentKidData: IFilteredWebsites) => {
        if (currentKidData.id === selectedKidId) {
            const newFilteredUrl: IUrls[] = currentKidData.urls.filter((url: IUrls) => url.name !== urlToRemoveName);
            finalWebsites.push({
                id: currentKidData.id,
                name: currentKidData.name,
                urls: newFilteredUrl,
            });
        } else finalWebsites.push(currentKidData);
        return finalWebsites;
    }, []);
    return finalWebsiteslocal;
};

export { addUrls, removeUrlItem };
