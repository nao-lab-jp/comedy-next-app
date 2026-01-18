// utils/artistHelper.js

/**
 * 芸人データを50音順にグループ化するヘルパー関数
 * データベースの clean配列 と kana配列 のインデックスを合わせて紐付けます
 */
export function groupArtists(lives) {
  const artistMap = new Map(); // 「芸人名」と「正規化されたよみ」のペア

  lives.forEach(live => {
    // データベースから配列として取得（nullの場合は空配列にする）
    const names = live.performers_clean || [];
    const kanas = live.performers_kana || []; 

    names.forEach((name, index) => {
      // 1文字以下の名前や、特定の除外ワードを省くフィルター
      if (!name || name.length <= 1 || ['MC', '出演', 'ゲスト', '他', '企画', '主催'].includes(name)) {
        return;
      }
        
      // ★修正1: データ欠け対策 ＆ 前後の空白削除(.trim)
      let yomi = (kanas[index] || name).trim();
      
      // ★修正2: カタカナをひらがなに変換（この時点で変換しておくことで、ソートも正確になります）
      // ア(30A2) -> あ(3042) の差分 0x60 を引く
      yomi = yomi.replace(/[\u30a1-\u30f6]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x60));

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
    const char = yomi.charAt(0);

    // ★修正3: 正規表現の範囲を微調整（小さい「ぁ」「っ」「ゃ」なども含むように変更）
    if (/[ぁ-おゔ]/.test(char)) groups["あ行"].push(name);      // ぁ〜お、ゔ
    else if (/[か-ご]/.test(char)) groups["か行"].push(name); // か〜ご（がぎぐげご含む）
    else if (/[さ-ぞ]/.test(char)) groups["さ行"].push(name); // さ〜ぞ（ざじずぜぞ含む）
    else if (/[た-ど]/.test(char)) groups["た行"].push(name); // た〜ど（っ、だぢづでど含む）
    else if (/[な-の]/.test(char)) groups["な行"].push(name);
    else if (/[は-ぽ]/.test(char)) groups["は行"].push(name); // は〜ぽ（ばぱ含む）
    else if (/[ま-も]/.test(char)) groups["ま行"].push(name);
    else if (/[ゃ-よ]/.test(char)) groups["や行"].push(name); // ゃ〜よ
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