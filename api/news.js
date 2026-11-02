import { searchNews } from '../server/news.js';

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate'); // 30분 캐시
    res.status(200).json(await searchNews({ topic: req.query.topic || undefined }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
