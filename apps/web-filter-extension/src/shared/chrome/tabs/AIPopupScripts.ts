import { BlockResult } from '@src/shared/chrome/tabs/ChromeTabHelper';

// export const addIframe = (blockResult: any) => {
//     const iframe = document.createElement('iframe');
//     iframe.attachShadow({ mode: 'open' });
//     const loadComplete = new Promise((resolve) => {
//         iframe.addEventListener('load', resolve);
//     });
//     const prefix = 'chrome-extension://' + chrome.runtime.id + '/src/prr.html';
//     const url = `${prefix}?ai=${blockResult.ai}&status=${blockResult.status}&category=${blockResult.category.toUpperCase()}&level=${blockResult.level}&host=${blockResult.host}`;
//     iframe.src = url;
//     document.documentElement.appendChild(iframe);
//     // await loadComplete;
//     return iframe?.contentWindow?.document.title;
// }

export const embedContent = (blockResult: BlockResult, tabId: number): void => {
    const parentDivId = 'safekids-chrome-integration';
    let elements = document.documentElement.getElementsByTagName(parentDivId);
    if (elements.length == 0) {
        const safekidsParentDiv = document.createElement(parentDivId);
        safekidsParentDiv.attachShadow({ mode: 'open' });
        safekidsParentDiv.style.height = '100vh';
        safekidsParentDiv.style.width = '100%';
        document.documentElement.appendChild(safekidsParentDiv);
        const innerContent = document.createElement('iframe');
        innerContent.style.width = '100%';
        innerContent.style.height = '100vh';
        const prefix = 'chrome-extension://' + chrome.runtime.id + '/src/pages/ui-prr/index.html';
        const url = `${prefix}?ai=${blockResult.ai}&status=${blockResult.status}&category=${blockResult.category.toUpperCase()}&level=${
            blockResult.level
        }&host=${blockResult.host}`;
        innerContent.src = url;
        innerContent.setAttribute('id', 'safekids-iframe');

        safekidsParentDiv.shadowRoot?.appendChild(innerContent);

        elements = document.documentElement.getElementsByTagName(parentDivId);
    }
    if (elements.length > 0) {
        const tabIdOldDisplayValue = `oldDisplayValue${tabId}`;
        document.body.style.display = 'none';
        for (let i = 0; i < elements.length; i++) {
            const element = elements.item(i) as HTMLElement;
            element.style.display = 'block';
        }
    }

    /* istanbul ignore next */
    window.addEventListener(
        'popstate',
        function (event) {
            // The popstate event is fired each time when the current history entry changes.
            const parentDivId = 'safekids-chrome-integration';
            let elements = document.documentElement.getElementsByTagName(parentDivId);
            if (elements.length > 0) {
                const safekidsParentDiv = elements[0] as HTMLElement;
                safekidsParentDiv.style.display = 'none';
                const key = `oldDisplayValue${tabId}`;
                document.body.style.display = '';
            }
        },
        { once: true }
    );

    // // Select the node that will be observed for mutations
    // const targetNode = document.body;

    // // Options for the observer (which mutations to observe)
    // const config: MutationObserverInit = { attributes: true, attributeFilter: ['style'], attributeOldValue: true };

    // const containsDisplayNone = (styleAttribute: string): boolean => {
    //     return styleAttribute.trim().includes('display:none');
    // }

    // // Callback function to execute when mutations are observed
    // const callback: MutationCallback = (mutationList) => {
    //     console.error('callback called')
    //     for (let i = 0; i < mutationList.length; i++) {
    //         console.log(`Mutation: ${JSON.stringify(mutationList[i])}`);
    //         if (mutationList[i].type === 'attributes') {
    //             if (mutationList[i].attributeName == 'style') {
    //                 console.log(`Old value was: ${JSON.stringify(mutationList[i].oldValue)}`)
    //                 const styleAttr = document.body.getAttribute('style');
    //                 console.log(`New value is: ${styleAttr}`)
    //                 if (!styleAttr) {
    //                     document.body.style.display = 'none';
    //                 }
    //                 if (styleAttr && !containsDisplayNone(styleAttr)) {
    //                     document.body.style.display = 'none';
    //                 }
    //             }
    //         }
    //     }
    // };

    // // Create an observer instance linked to the callback function
    // console.error('creating observer')
    // const observer = new MutationObserver(callback);

    // // Start observing the target node for configured mutations
    // observer.observe(targetNode, config);

    // // Later, you can stop observing
    // observer.disconnect();
};

export const removeContent = (tabId: number): void => {
    const parentDivId = 'safekids-chrome-integration';
    let elements = document.documentElement.getElementsByTagName(parentDivId);
    if (elements.length > 0) {
        const safekidsParentDiv = elements[0] as HTMLElement;
        safekidsParentDiv.style.display = 'none';
        const key = `oldDisplayValue${tabId}`;
        document.body.style.display = '';
        // chrome.storage.local.get([key], function (result) {
        //     console.error(`fetched display: ${result[key]}`);
        //     document.body.style.display = result[key];
        // });
    }
};
