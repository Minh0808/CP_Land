"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/rssNews.ts
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const cheerio_1 = require("cheerio");
const router = (0, express_1.Router)();
const RSS_URL = 'https://vnexpress.net/rss/bat-dong-san.rss';
// GET /api/rss/hot-real
router.get('/hot-real', async (_req, res) => {
    try {
        // 1) Fetch XML dưới dạng text
        const response = await axios_1.default.get(RSS_URL, {
            responseType: 'text',
            headers: { 'Accept': 'application/rss+xml' },
        });
        const xml = response.data;
        console.log('[RSS] Received XML length:', xml.length);
        // 2) Parse XML → JS object
        const result = await (0, xml2js_1.parseStringPromise)(xml, { trim: true });
        const items = result.rss.channel[0].item || [];
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
            const $ = (0, cheerio_1.load)(descHtml);
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
        return;
    }
    catch (err) {
        console.error('[RSS] Fetch/Parse error:', err);
        if (axios_1.default.isAxiosError(err) && err.response) {
            console.error('Axios status:', err.response.status);
            console.error('Axios data:', err.response.data);
        }
        res.status(500).json({ message: 'Không lấy được RSS feed' });
    }
});
exports.default = router;
