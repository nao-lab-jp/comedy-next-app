import { createClient } from '@supabase/supabase-js'

// Vercelに設定した名前(Key)と、ここの名前が完全に一致している必要があります
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// URLがない場合にエラー内容をわかりやすくする（デバッグ用）
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Key is missing. Check Environment Variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase