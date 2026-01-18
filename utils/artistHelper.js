/**
 * 芸人データを50音順にグループ化するヘルパー関数
 * データベースの clean配列 と kana配列 のインデックスを合わせて紐付けます
 */
export function groupArtists(lives) {
  // 名前をキーにして、よみがなを保存するマップ（重複排除用）
  const artistMap = new Map();

  lives.forEach(live => {
    const names = live.performers_clean || [];
    const kanas = live.performers_kana || []; 

    names.forEach((name, index) => {
      // 除外フィルター
      if (!name || name.length <= 1 || ['MC', '出演', 'ゲスト', '他', '企画', '主催'].includes(name)) {
        return;
      }
        
      // 1. よみがなを取得（データ欠け対策）＆ 前後の空白削除
      let yomi = (kanas[index] || name).trim();
      
      // 2. カタカナをひらがなに統一変換
      // ア(30A2) -> あ(3042) の差分 0x60 を引いて変換
      yomi = yomi.replace(/[\u30a1-\u30f6]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x60));

      // 重複登録を防ぐ（既に登録済みならスキップ）
      if (!artistMap.has(name)) {
        artistMap.set(name, yomi);
      }
    });
  });

  // 分類用の箱を用意
  const groups = {
    "あ行": [], "か行": [], "さ行": [], "た行": [], "な行": [],
    "は行": [], "ま行": [], "や行": [], "ら行": [], "わ行": [], "A-Z/他": []
  };

  // 3. 振り分け処理
  artistMap.forEach((yomi, name) => {
    const char = yomi.charAt(0);
    // UI側で使いやすいように { name, kana } のオブジェクト形式で保存します
    const artistObj = { name, kana: yomi };

    // 判定ロジック（小さい「っ」「ゃ」や濁点も漏らさないように範囲を調整）
    if (/[ぁ-おゔ]/.test(char)) groups["あ行"].push(artistObj);
    else if (/[か-ごゕゖ]/.test(char)) groups["か行"].push(artistObj);
    else if (/[さ-ぞ]/.test(char)) groups["さ行"].push(artistObj);
    else if (/[た-どっ]/.test(char)) groups["た行"].push(artistObj); // 「っ」はた行扱い
    else if (/[な-の]/.test(char)) groups["な行"].push(artistObj);
    else if (/[は-ぽ]/.test(char)) groups["は行"].push(artistObj);
    else if (/[ま-も]/.test(char)) groups["ま行"].push(artistObj);
    else if (/[ゃ-よ]/.test(char)) groups["や行"].push(artistObj);
    else if (/[ら-ろ]/.test(char)) groups["ら行"].push(artistObj);
    else if (/[わ-ん]/.test(char)) groups["わ行"].push(artistObj);
    else groups["A-Z/他"].push(artistObj);
  });
  
  // 4. 各行の中で「あいうえお順」に並び替える
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => a.kana.localeCompare(b.kana, 'ja'));
  });

  return groups;
}