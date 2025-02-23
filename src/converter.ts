/**
 * データ変換モジュール
 */

import { TaskList } from "./definitions/tasklist";

interface TaskData {
  起床: {
    時: number;
    分: number;
  };
  散歩: {
    実施: boolean;
    ゴミ拾い: boolean;
    犬遭遇: {
      数: number;
      備考: string;
    };
  };
  朝食: {
    三色食品群のうち: number;
  };
  体操: boolean;
  労働: {
    passion: number;
    discipline: number;
    備考: string;
  };
  ジム: string;
  勉強会: boolean;
  個人開発: boolean;
  あすけんの点数?: number;
}

interface FormattedItem {
  項目: keyof TaskList;
  時?: number;
  分?: number;
  データ?: any;
}

interface ConversionResult {
  markdown: string;
  json: {
    items: FormattedItem[];
    totalScore: number;
  };
}

/**
 * 入力データを整形された形式に変換する
 * @param {TaskData} data - 変換するJSONデータ
 * @returns {ConversionResult} 変換結果（markdown形式とjson形式）
 */
export function convertData(data: TaskData): ConversionResult {
  const requiredItems: (keyof TaskData)[] = [
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
  const formattedData: FormattedItem[] = requiredItems.map((item) => {
    if (item === "起床") {
      const 起床データ = data.起床;
      return {
        項目: item,
        時: 起床データ.時,
        分: 起床データ.分,
      };
    } else {
      return {
        項目: item,
        データ: data[item],
      };
    }
  });

  // あすけんの点数を追加
  if (data.あすけんの点数 !== undefined) {
    formattedData.push({
      項目: "あすけんの点数",
      データ: data.あすけんの点数,
    });
  }

  // 総合点の計算
  const weights: Record<keyof TaskList, number> = {
    起床: 20,
    散歩: 10,
    朝食: 15,
    体操: 5,
    労働: 40,
    ジム: 20,
    勉強会: 20,
    個人開発: 10,
    あすけんの点数: 15,
  };

  const scores: number[] = formattedData.map((item) => {
    const score =
      item.項目 === "あすけんの点数"
        ? item.データ
        : item.項目 === "起床"
          ? calculateScore(item.項目, item)
          : calculateScore(item.項目, item.データ);
    return score * (weights[item.項目] || 0);
  });

  // 重みの合計を計算
  const totalWeight: number = Object.values(weights).reduce(
    (sum, weight) => sum + weight,
    0
  );

  const totalScore: number = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / totalWeight
  );

  return {
    markdown: convertToMarkdown(formattedData, totalScore),
    json: {
      items: formattedData,
      totalScore,
    },
  };
}

/**
 * 項目ごとの得点を計算する
 * @param {string} 項目 - 項目名
 * @param {any} データ - 項目のデータ
 * @returns {number} 計算された得点
 */
function calculateScore(項目: string, データ: any): number {
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
      return Math.round((データ.passion + データ.discipline) / 2);

    case "ジム":
      // サボった以外は100点
      return データ === "サボった" ? 0 : 100;

    case "勉強会":
    case "個人開発":
    case "歯磨き":
      // 実施で100点、未実施で0点
      return データ ? 100 : 0;

    default:
      return 0;
  }
}

/**
 * データをMarkdown表形式に変換する
 * @param {FormattedItem[]} items - 変換するデータ配列
 * @param {number} totalScore - 総合点
 * @returns {string} Markdown形式の文字列
 */
function convertToMarkdown(items: FormattedItem[], totalScore: number): string {
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

      case "労働":
        text = `passion: ${データ.passion}点, discipline: ${データ.discipline}点（${データ.備考}）`;
        score = calculateScore(項目, データ);
        break;

      case "ジム":
        text = データ;
        score = calculateScore(項目, データ);
        break;

      case "体操":
      case "勉強会":
      case "個人開発":
        text = データ ? "実施" : "ノー";
        score = calculateScore(項目, データ);
        break;

      case "あすけんの点数":
        text = "-";
        score = データ;
        break;
    }

    markdown += `| ${項目} | ${text} | ${score} |\n`;
  });

  markdown += "| **総合** | **1日の総合評価** | **" + totalScore + "** |\n";
  return markdown;
}
