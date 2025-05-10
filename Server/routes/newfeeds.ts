// server/routes/rssNews.ts
import { Router, Request, Response } from 'express';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { load } from 'cheerio';

const router = Router();
const RSS_URL = 'https://vnexpress.net/rss/bat-dong-san.rss';

// GET /api/rss/hot-real
router.get('/hot-real', async (_req: Request, res: Response) => {
   try {
      // 1) Fetch XML dưới dạng text
      const response = await axios.get<string>(RSS_URL, {
         responseType: 'text',
         headers: { 'Accept': 'application/rss+xml' },
      });
      const xml = response.data;
      console.log('[RSS] Received XML length:', xml.length);

      // 2) Parse XML → JS object
      const result = await parseStringPromise(xml, { trim: true });
      const items: any[] = result.rss.channel[0].item || [];

      // 3) Tính ngày hôm nay
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 4) Map + filter + slice
      const news = items
         .map(item => {
         const title = item.title?.[0] || '';
         const link = item.link?.[0] || '';
         const pubDateRaw = item.pubDate?.[0] || '';
         const pubDate = new Date(pubDateRaw);
         const descHtml = item.description?.[0] || '';

         // Dùng cheerio để lấy ảnh + summary text
         const $ = load(descHtml);
         const image = $('img').first().attr('src') || '';
         $('img').remove(); // bỏ thẻ img để lấy text summary
         const summary = $.root().text().trim();

         return { title, link, pubDate, image, summary };
         })
         // Chỉ giữ tin trong ngày hôm nay
         // .filter(n => n.pubDate >= today && n.pubDate < tomorrow)
         // Lấy tối đa 10 tin
         .slice(0, 12);

      res.json(news);
      return
   } catch (err) {
      console.error('[RSS] Fetch/Parse error:', err);
      if (axios.isAxiosError(err) && err.response) {
         console.error('Axios status:', err.response.status);
         console.error('Axios data:', err.response.data);
      }
      res.status(500).json({ message: 'Không lấy được RSS feed' })
   }
});

export default router;
