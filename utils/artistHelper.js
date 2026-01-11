// utils/artistHelper.js

/**
 * 芸人データを50音順にグループ化するヘルパー関数
 * データベースの clean配列 と kana配列 のインデックスを合わせて紐付けます
 */
export function groupArtists(lives) {
  const artistMap = new Map(); // 「芸人名」と「よみ」のペアを保存する場所

  lives.forEach(live => {
    // データベースから配列として取得（nullの場合は空配列にする）
    const names = live.performers_clean || [];
    const kanas = live.performers_kana || []; 

    names.forEach((name, index) => {
      // 1文字以下の名前や、特定の除外ワードを省くフィルター
      if (!name || name.length <= 1 || ['MC', '出演', 'ゲスト', '他', '企画', '主催'].includes(name)) {
        return;
      }
        
      // ★重要：同じインデックスの「よみがな」を取得
      // データ欠け対策：かなが無ければ名前をそのまま使う
      const yomi = kanas[index] || name;
      
      // 重複を防ぐため、まだ登録していない名前だけ追加
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

  // 全芸人をループして箱に振り分ける
  artistMap.forEach((yomi, name) => {
    // 読み仮名の1文字目を取得
    let char = yomi.charAt(0);
    
    // カタカナならひらがなに変換（正規表現でシフト変換）
    // ア(30A2) -> あ(3042) の差分が 0x60
    char = char.replace(/[\u30a1-\u30f6]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x60));

    // Unicode範囲で判定
    if (/[あ-お]/.test(char)) groups["あ行"].push(name);
    else if (/[か-ご]/.test(char)) groups["か行"].push(name);
    else if (/[さ-ぞ]/.test(char)) groups["さ行"].push(name);
    else if (/[た-ど]/.test(char)) groups["た行"].push(name);
    else if (/[な-の]/.test(char)) groups["な行"].push(name);
    else if (/[は-ぽ]/.test(char)) groups["は行"].push(name);
    else if (/[ま-も]/.test(char)) groups["ま行"].push(name);
    else if (/[や-よ]/.test(char)) groups["や行"].push(name);
    else if (/[ら-ろ]/.test(char)) groups["ら行"].push(name);
    else if (/[わ-ん]/.test(char)) groups["わ行"].push(name);
    else groups["A-Z/他"].push(name);
  });
  
  // 各行の中で「あいうえお順」に並び替える
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => {
      const yomiA = artistMap.get(a);
      const yomiB = artistMap.get(b);
      return yomiA.localeCompare(yomiB, 'ja');
    });
  });

  return groups;
}