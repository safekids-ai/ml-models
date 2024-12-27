import axios from 'axios';
import { parse } from 'node-html-parser';
import {HTMLWebData} from '@safekids-ai/web-category-types';
import {htmlToText} from 'html-to-text';

class WebContentScraper {
  private readonly htmlTextOptions = {
    wordwrap: null, // Disable word wrapping for long text blocks
    selectors: [
      { selector: 'title', format: 'skip' },  // Skip <title> (can handle separately)
      { selector: 'h1', format: 'heading' },  // Handle <h1> headings
      { selector: 'h2', format: 'heading' },  // Handle <h2> headings
      { selector: 'div', format: 'block' },   // Include <div> elements
      { selector: 'span', format: 'inline' }, // Include <span> elements (inline text)
      { selector: 'p', format: 'paragraph' }, // Include paragraphs
      { selector: 'form', format: 'skip' },   // Skip forms
      { selector: 'select', format: 'skip' }, // Skip combo boxes
      { selector: 'input', format: 'skip' },  // Skip input fields
      { selector: 'button', format: 'skip' }, // Skip buttons
      { selector: 'img', format: 'skip' },    // Skip images (embedded data URI or otherwise)
      { selector: '[src^="data:"]', format: 'skip' },  // Skip any elements with base64-encoded data URIs
    ],
    limits: { maxInputLength: 1000000 }, // Adjust to handle larger HTML input
  };

  async getHtmlData(url: string): Promise<HTMLWebData> {
    const axiosConfig = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.110 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'origin' : url,
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Chromium";v="114", "Google Chrome";v="114", "Not:A-Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
      },
      responseType: 'text' as const,
      decompress: true,
    };

    const {data} = await axios.get(url, axiosConfig);

    const htmlText = htmlToText(data, this.htmlTextOptions);

    const root = parse(data);

    const title = root.querySelector('title')?.text.trim() || '';
    const description = root.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const keywords = root.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    const ogType = root.querySelector('meta[property="og:type"]')?.getAttribute('content') || '';
    const ogTitle = root.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    const ogDescription = root.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    const ogUrl = root.querySelector('meta[property="og:url"]')?.getAttribute('content') || '';

    return {
      title,
      description,
      keywords,
      ogType,
      ogDescription,
      ogUrl,
      htmlText,
    };
  }
}

export {WebContentScraper}
