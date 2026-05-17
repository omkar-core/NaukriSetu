import Parser from 'rss-parser';
import { logger } from '../../utils/logger.js';

const parser = new Parser({ timeout: 10000, headers: { 'User-Agent': 'NaukriSetu/1.0 (+https://naukrisetu.in; support@naukrisetu.in)' } });

const RSS_FEEDS = [
  { url: 'https://www.ssc.gov.in/rss/', name: 'SSC' },
  { url: 'https://www.upsc.gov.in/rss.xml', name: 'UPSC' },
  { url: 'https://www.employmentnews.gov.in/rss/feed.aspx', name: 'Employment News' },
  { url: 'https://ncs.gov.in/rss', name: 'NCS Portal' },
];

export async function fetchFromRSSFeeds() {
  const allItems = [];

  for (const feed of RSS_FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      const items = (result.items || []).slice(0, 20).map(item => ({
        rawTitle: item.title || '',
        rawOrganization: feed.name,
        rawDescription: item.contentSnippet || item.summary || '',
        rawSourceUrl: item.link || '',
        rawSourceName: `RSS:${feed.name}`,
        rawPublishedAt: item.pubDate || item.isoDate,
      })).filter(item => item.rawTitle && item.rawSourceUrl);
      allItems.push(...items);
      logger.cron(`RSS: ${feed.name} — ${items.length} items`);
      // Respect government server rate limits — wait 1s between feeds
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      logger.warn(`RSS feed failed (${feed.name}): ${err.message}`);
    }
  }

  return allItems;
}
