import { searchHistory } from '../server/history.js';

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // 자주 안 바뀌는 데이터라 1시간 캐시
    res.status(200).json(await searchHistory({ keyword: req.query.keyword }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
