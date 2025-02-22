/**
 * データ変換モジュール
 */

/**
 * 入力データを整形された形式に変換する
 * @param {Object} data - 変換するJSONデータ
 * @returns {Object} 変換結果（markdown形式とjson形式）
 */
export function convertData(data) {
  const requiredItems = [
    "起床",
    "散歩",
    "朝食",
    "体操",
    "労働",
    "ジム",
    "勉強会",
    "個人開発",
  ];

  // データの整形
  const formattedData = requiredItems.map((item) => {
    if (item === "起床") {
      return {
        項目: item,
        時: data[item].時,
        分: data[item].分,
      };
    } else {
      return {
        項目: item,
        データ: data[item],
      };
    }
  });

  // その他の項目の追加
  if (data.その他 && Array.isArray(data.その他)) {
    data.その他.forEach((item) => {
      formattedData.push({
        項目: item.題目,
        データ: item,
      });
    });
  }

  // 総合点の計算
  const weights = {
    起床: 0.15,
    散歩: 0.1,
    朝食: 0.15,
    体操: 0.1,
    労働: 0.25,
    ジム: 0.1,
    勉強会: 0.05,
    個人開発: 0.1,
  };

  const scores = formattedData.map((item) => {
    if (item.項目 === "起床") {
      return calculateScore(item.項目, item) * weights[item.項目];
    }
    return calculateScore(item.項目, item.データ) * (weights[item.項目] || 0);
  });

  const totalScore = Math.round(scores.reduce((sum, score) => sum + score, 0));

  return {
    markdown: convertToMarkdown(formattedData, totalScore),
    json: {
      items: formattedData,
      totalScore,
    },
  };
}

/**
 * データをMarkdown文章形式に変換する
 * @param {Array} items - 変換するデータ配列
 * @returns {string} Markdown形式の文字列
 */
/**
 * 項目ごとの得点を計算する
 * @param {string} 項目 - 項目名
 * @param {Object} データ - 項目のデータ
 * @returns {number} 計算された得点
 */
function calculateScore(項目, データ) {
  switch (項目) {
    case "起床": {
      // 8時以前=100点、8時から10時までで線形減少
      const 時間 = データ.時 + データ.分 / 60;
      if (時間 <= 8) {
        return 100;
      } else if (時間 >= 10) {
        return 0;
      } else {
        // 8時から10時までの2時間で100点から0点まで線形減少
        return Math.round((10 - 時間) * 50); // (10-時間)/(10-8) * 100
      }
    }

    case "散歩":
      // 実施で100点 + 犬遭遇数×10点（上限なし）
      return データ.実施 ? 100 + データ.犬遭遇.数 * 10 : 0;

    case "朝食": {
      // 色数に応じた点数（0色=0点、1色=60点、2色=80点、3色以上=100点）
      const 色数 = データ.三色食品群のうち;
      if (色数 === 0) return 0;
      if (色数 === 1) return 60;
      if (色数 === 2) return 80;
      return 100;
    }

    case "体操":
      // 実施で100点、未実施で0点
      return データ ? 100 : 0;

    case "労働":
      // 質と自己管理の平均点
      return Math.round((データ.質 + データ.自己管理) / 2);

    case "ジム":
      // サボった以外は100点
      return データ === "サボった" ? 0 : 100;

    case "勉強会":
    case "個人開発":
    case "歯磨き":
      // 実施で100点、未実施で0点
      return データ ? 100 : 0;

    default:
      // その他の項目は入力された得点をそのまま使用
      return データ.得点;
  }
}

/**
 * データをMarkdown表形式に変換する
 * @param {Array} items - 変換するデータ配列
 * @returns {string} Markdown形式の文字列
 */
function convertToMarkdown(items, totalScore) {
  let markdown = "| 項目 | 内容 | 得点 |\n| ---- | ---- | ---- |\n";

  items.forEach((item) => {
    const { 項目, データ } = item;
    let text = "";
    let score = 0;

    switch (項目) {
      case "起床":
        text = `${item.時}:${item.分}`;
        score = calculateScore(項目, item);
        break;

      case "散歩":
        text = `${データ.実施 ? "実施" : "未実施"}${
          データ.ゴミ拾い ? "・ゴミ拾いあり" : ""
        }・犬${データ.犬遭遇.数}匹（${データ.犬遭遇.備考}）`;
        score = calculateScore(項目, データ);
        break;

      case "朝食":
        text = `三色食品群のうち${データ.三色食品群のうち}色カバー`;
        score = calculateScore(項目, データ);
        break;

      case "体操":
        text = データ ? "体操した" : "体操しなかった";
        score = calculateScore(項目, データ);
        break;

      case "労働":
        text = `仕事の質は${データ.質}点、自己管理は${データ.自己管理}点（${データ.備考}）`;
        score = calculateScore(項目, データ);
        break;

      case "ジム":
        text = データ;
        score = calculateScore(項目, データ);
        break;

      case "勉強会":
      case "個人開発":
        text = `${項目}を${データ ? "行った" : "行わなかった"}`;
        score = calculateScore(項目, データ);
        break;

      default:
        text = データ.題目;
        score = データ.得点;
        break;
    }

    markdown += `| ${項目} | ${text} | ${score} |\n`;
  });

  markdown += "| **総合** | **1日の総合評価** | **" + totalScore + "** |\n";
  return markdown;
}
