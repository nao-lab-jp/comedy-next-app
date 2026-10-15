import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// どちらが欠けているか、具体的に教えてくれるように変更
if (!supabaseUrl) {
    throw new Error(`エラー: NEXT_PUBLIC_SUPABASE_URL が設定されていません。現在の値: ${supabaseUrl}`);
}
if (!supabaseKey) {
    throw new Error(`エラー: NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません。`);
}

// Next.js 15以降、fetchの既定は no-store。supabase-jsが内部で使うfetchをそのままに
// しておくと、呼び出したルート全体が動的レンダリング扱いになり、ページ側に書いた
// revalidate(ISR)が無視される。実際、芸人ページは revalidate = 86400 を指定しても
// Cache-Control: private, no-cache, no-store のままだった。
// キャッシュ可能なfetchを渡すことでページをISRに載せる。Vercelの Fluid Active CPU と
// Supabaseのegressの両方を抑えるのが狙い。
//
// この値はfetchを呼んだページのrevalidateの上限にもなる(短い方が使われる)。1日にしていた間は
// 芸人ページの revalidate を2日・7日にしても実際は1日ごとに描き直されていた。
// 芸人ページはスクレイパーが変わったものだけ再生成させる(/api/revalidate)ので、ページ側と同じ
// 7日に揃える。紹介文(artist_profiles)の更新が反映されるのは最長7日後になる。
const REVALIDATE_SECONDS = 604800

const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
        fetch: (input, init = {}) =>
            fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS } }),
    },
})

export default supabase
