import axios from 'axios';
import * as cheerio from 'cheerio';
import {WebMeta} from "./web-category-types";


class WebContentScraper {
  async getMetadata(url: string): Promise<WebMeta> {
    try {
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
          'Cache-Control': 'max-age=0',
        },
        responseType: 'text' as const,
        decompress: true,
      };

      const {data} = await axios.get(url, axiosConfig);
      const $ = cheerio.load(data);
      const title = $('head > title').text();
      const description = $('meta[name="description"]').attr('content');
      const keywords = $('meta[name="keywords"]').attr('content');
      const ogType = $('meta[property="og:type"]').attr('content');
      const ogTitle = $('meta[property="og:title"]').attr('content');
      const ogDescription = $('meta[property="og:description"]').attr('content');
      const ogUrl = $('meta[property="og:url"]').attr('content');

      return {
        title,
        description,
        keywords,
        ogType,
        ogDescription,
        ogUrl
      };
    } catch (error) {
      throw new Error(`Failed to scrape the website ${url}: ${error}`);
    }
  }
}

export {WebMeta, WebContentScraper}
