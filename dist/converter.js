/**
 * データ変換モジュール
 */
const 起床Formatter = {
    文言を得る: (データ) => `${データ.時}:${String(データ.分).padStart(2, "0")}`,
    点数を得る: (データ) => {
        const 時間 = データ.時 + データ.分 / 60;
        if (時間 <= 8)
            return 100;
        if (時間 >= 10)
            return 0;
        return Math.round((10 - 時間) * 50);
    },
};
const 散歩Formatter = {
    文言を得る: (データ) => {
        if (!データ.実施) {
            return "ノー";
        }
        return `実施・${データ.ゴミ拾い ? "・ゴミ拾いあり" : "ゴミ拾いなし"}・犬遭遇${データ.犬遭遇.数}匹（${データ.犬遭遇.備考}）`;
    },
    点数を得る: (データ) => (データ.実施 ? 100 + データ.犬遭遇.数 * 10 : 0),
};
const 朝食の栄養カバレッジFormatter = {
    文言を得る: (データ) => `${データ}色カバー`,
    点数を得る: (データ) => {
        const 色数 = Number(データ);
        if (色数 === 0)
            return 0;
        if (色数 === 1)
            return 60;
        if (色数 === 2)
            return 80;
        return 100;
    },
};
const 体操Formatter = {
    文言を得る: (データ) => (データ ? "実施" : "ノー"),
    点数を得る: (データ) => (データ ? 100 : 0),
};
const 労働Formatter = {
    文言を得る: (データ) => {
        if (データ.状態 === "休日") {
            return `休日${データ.備考 ? `（${データ.備考}）` : ""}`;
        }
        return `${データ.状態}・passion: ${データ.passion}点, discipline: ${データ.discipline}点（${データ.備考}）`;
    },
    点数を得る: (データ) => {
        if (データ.状態 === "休日") {
            return 100;
        }
        return Math.round((データ.passion + データ.discipline) / 2);
    },
};
const ジムFormatter = {
    文言を得る: (データ) => データ,
    点数を得る: (データ) => (データ === "サボった" ? 0 : 100),
};
const 勉強会Formatter = {
    文言を得る: (データ) => (データ ? "参加" : "ノー"),
    点数を得る: (データ) => (データ ? 100 : 0),
};
const 個人開発Formatter = {
    文言を得る: (データ) => (データ ? "実施" : "ノー"),
    点数を得る: (データ) => (データ ? 100 : 0),
};
const あすけんFormatter = {
    文言を得る: () => "-",
    点数を得る: (データ) => データ ?? 0,
};
const formatters = {
    起床: 起床Formatter,
    散歩: 散歩Formatter,
    "朝食の栄養カバレッジ": 朝食の栄養カバレッジFormatter,
    体操: 体操Formatter,
    労働: 労働Formatter,
    ジム: ジムFormatter,
    勉強会: 勉強会Formatter,
    個人開発: 個人開発Formatter,
    あすけん: あすけんFormatter,
};
/**
 * 入力データを整形された形式に変換する
 * @param {TaskList} data - 変換するJSONデータ
 * @returns {ConversionResult} 変換結果（markdown形式とjson形式）
 */
export function convertData(data) {
    const requiredItems = [
        "起床",
        "散歩",
        "朝食の栄養カバレッジ",
        "体操",
        "労働",
        "ジム",
        "勉強会",
        "個人開発",
        "あすけん",
    ];
    // データの整形
    const formattedData = requiredItems.map((item) => ({
        題目: item,
        データ: data[item],
    }));
    // 総合点の計算
    const weights = {
        起床: 13,
        散歩: 6,
        朝食の栄養カバレッジ: 10,
        体操: 3,
        労働: 26,
        ジム: 13,
        勉強会: 13,
        個人開発: 6,
        あすけん: 10,
    };
    const scores = formattedData.map((item) => {
        const formatter = formatters[item.題目];
        const score = formatter.点数を得る(item.データ);
        return score * weights[item.題目];
    });
    // 重みの合計を計算
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const totalScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / totalWeight);
    return {
        markdown: convertToMarkdown(formattedData, totalScore),
        json: {
            items: formattedData,
            totalScore,
        },
    };
}
/**
 * データをMarkdown表形式に変換する
 * @param {Array<FormattedItem2<keyof TaskList>>} items - 変換するデータ配列
 * @param {number} totalScore - 総合点
 * @returns {string} Markdown形式の文字列
 */
function convertToMarkdown(items, totalScore) {
    let markdown = "| 項目 | 内容 | 得点 |\n| ---- | ---- | ---- |\n";
    items.forEach((item) => {
        const formatter = formatters[item.題目];
        const text = formatter.文言を得る(item.データ);
        const score = formatter.点数を得る(item.データ);
        markdown += `| ${item.題目} | ${text} | ${score} |\n`;
    });
    markdown += "| **総合** | **1日の総合評価** | **" + totalScore + "** |\n";
    return markdown;
}
