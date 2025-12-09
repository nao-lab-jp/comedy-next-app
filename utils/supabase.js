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

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase