import { createHash, timingSafeEqual } from 'crypto';
import { revalidatePath } from 'next/cache';

// スクレイパー(comedy-scraper/publish_site_data.py)が、Supabaseのデータを更新した後に
// 中身が変わった芸人ページと一覧ページだけを再生成させるための口。
//
// 2026-10-15まではデータの更新=再デプロイで、デプロイのたびにISRキャッシュが全て捨てられて
// いた。実際に中身が変わる芸人ページは1回あたり約15%なので、それだけを再生成させる。
//
// 認証はBearerトークン。ここにはそのSHA-256だけを置き、トークン本体はスクレイパー
// (Cloud Run comedy-scraper-job の環境変数 REVALIDATE_TOKEN)とローカルの .env.local にだけある。
const TOKEN_SHA256 = Buffer.from(
  '6230945d0119c716d36bb566e902e6b19b4b2efaad981ff9f7924a24ba6fda96',
  'hex'
);

const MAX_ARTISTS = 200;

// 公演一覧(site_snapshots)が変わった時に作り直すページ
const LIST_PAGES = [
  ['/'],
  ['/today'],
  ['/tomorrow'],
  ['/weekend'],
  ['/area/[slug]', 'page'],
  ['/sitemap.xml'],
];

function authorized(request) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  const digest = createHash('sha256').update(token).digest();
  return timingSafeEqual(digest, TOKEN_SHA256);
}

export async function POST(request) {
  if (!authorized(request)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }

  const artists = Array.isArray(body?.artists) ? body.artists : [];
  if (artists.length > MAX_ARTISTS || artists.some(name => typeof name !== 'string' || !name)) {
    return Response.json({ error: `artists must be up to ${MAX_ARTISTS} non-empty strings` }, { status: 400 });
  }

  for (const name of artists) {
    // キャッシュのキーがエンコード済みのパスか元の文字列かはNext.jsの版によって
    // 揺れがあるため、両方を指定しておく
    revalidatePath(`/artist/${encodeURIComponent(name)}`);
    revalidatePath(`/artist/${name}`);
  }

  if (body?.listPages) {
    for (const [path, type] of LIST_PAGES) revalidatePath(path, type);
  }

  return Response.json({ artists: artists.length, listPages: Boolean(body?.listPages) });
}
