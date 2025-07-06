/**
 * データ変換モジュール
 */
export const 起床Formatter = {
    文言を得る: (データ) => `${データ.時}:${String(データ.分).padStart(2, "0")}`,
    点数を得る: (データ) => {
        const 時間 = データ.時 + データ.分 / 60;
        if (時間 <= 5)
            return 0; // 5時以前は0点
        if (時間 < 7)
            return Math.round((時間 - 5) * 50); // 5時〜7時は線形増加
        if (時間 <= 8)
            return 100; // 7時〜8時は100点
        if (時間 < 10)
            return Math.round((10 - 時間) * 50); // 8時〜10時は線形減少
        return 0; // 10時以降は0点
    },
};
export const 散歩Formatter = {
    文言を得る: (データ) => {
        if (!データ.実施) {
            return "ノー";
        }
        return `実施・${データ.ゴミ拾い ? "ゴミ拾いあり" : "ゴミ拾いなし"}`;
    },
    点数を得る: (データ) => (データ.実施 ? 100 : 0),
};
export const 朝食の栄養カバレッジFormatter = {
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
export const 体操Formatter = {
    文言を得る: (データ) => (データ ? "実施" : "ノー"),
    点数を得る: (データ) => (データ ? 100 : 0),
};
export const 労働Formatter = {
    文言を得る: (データ) => {
        if (データ.状態 === "休日") {
            return `休日${データ.備考 ? `（${データ.備考}）` : ""}`;
        }
        return `passion: ${データ.passion}点, discipline: ${データ.discipline}点${データ.備考 ? `（${データ.備考}）` : ""}`;
    },
    点数を得る: (データ) => {
        if (データ.状態 === "休日") {
            return 100;
        }
        return Math.round((データ.passion + データ.discipline) / 2);
    },
};
export const 睡眠時間Formatter = {
    文言を得る: (データ) => {
        return `${データ.時間}時間${データ.分}分`;
    },
    点数を得る: (データ) => {
        const totalMinutes = データ.時間 * 60 + データ.分;
        const minMinutes = 4 * 60 + 30; // 4時間30分
        const maxMinutes = 7 * 60; // 7時間
        if (totalMinutes <= minMinutes)
            return 0;
        if (totalMinutes >= maxMinutes)
            return 100;
        return Math.round(((totalMinutes - minMinutes) / (maxMinutes - minMinutes)) * 100);
    },
};
export const ジムFormatter = {
    文言を得る: (データ) => データ,
    点数を得る: (データ) => (データ === "サボった" ? 0 : 100),
};
export const 勉強会Formatter = {
    文言を得る: (データ) => (データ ? "参加" : "ノー"),
    点数を得る: (データ) => (データ ? 100 : 0),
};
export const 個人開発Formatter = {
    文言を得る: (データ) => (データ ? "実施" : "ノー"),
    点数を得る: (データ) => (データ ? 100 : 0),
};
export const あすけんFormatter = {
    文言を得る: () => "-",
    点数を得る: (データ) => データ ?? 0,
};
export const 体重測定Formatter = {
    文言を得る: (データ) => (データ ? "実施" : "ノー"),
    点数を得る: (データ) => (データ ? 100 : 0),
};
const formatters = {
    起床: 起床Formatter,
    散歩: 散歩Formatter,
    朝食の栄養カバレッジ: 朝食の栄養カバレッジFormatter,
    体操: 体操Formatter,
    労働: 労働Formatter,
    ジム: ジムFormatter,
    勉強会: 勉強会Formatter,
    個人開発: 個人開発Formatter,
    あすけん: あすけんFormatter,
    睡眠時間: 睡眠時間Formatter,
    体重測定: 体重測定Formatter,
};
/**
 * 入力データを整形された形式に変換する
 * @param {TaskList} data - 変換するJSONデータ
 * @returns {ConversionResult} 変換結果（markdown形式）
 */
export function convertData(data) {
    const requiredItems = [
        "睡眠時間",
        "起床",
        "散歩",
        "朝食の栄養カバレッジ",
        "体操",
        "労働",
        "ジム",
        "勉強会",
        "個人開発",
        "あすけん",
        "体重測定",
    ];
    // データの整形
    const formattedData = requiredItems.map((item) => ({
        題目: item,
        データ: data[item],
    }));
    // 総合点の計算
    const weights = {
        起床: 8,
        散歩: 5,
        朝食の栄養カバレッジ: 4,
        体操: 5,
        労働: 24,
        ジム: 11,
        勉強会: 12,
        個人開発: 7,
        あすけん: 9,
        睡眠時間: 12,
        体重測定: 3,
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
        markdown: convertToMarkdown(formattedData, totalScore, weights, totalWeight),
    };
}
/**
 * データをMarkdown表形式に変換する
 * @param {Array<FormattedItem2<keyof TaskList>>} items - 変換するデータ配列
 * @param {number} totalScore - 総合点
 * @returns {string} Markdown形式の文字列
 */
function convertToMarkdown(items, totalScore, weights, totalWeight) {
    let markdown = "| 項目 | 内容 | 得点 | 換算点 |\n| ---- | ---- | ---: | ---: |\n";
    items.forEach((item) => {
        const formatter = formatters[item.題目];
        const text = formatter.文言を得る(item.データ);
        const score = formatter.点数を得る(item.データ); // 素点 (0-100)
        const weight = weights[item.題目]; // 重み m
        // n = 重みに従って換算したあとの得点 (素点 * 重み / 100)
        const convertedScore = (score * weight) / 100;
        // n と m を両方小数点第一位まで表示
        const convertedScoreText = `${convertedScore.toFixed(1)}/${weight.toFixed(1)}`; // n/m 形式
        markdown += `| ${item.題目} | ${text} | ${score} | ${convertedScoreText} |\n`;
    });
    // 総合点の換算点表示はハイフンにする
    const totalConvertedScoreText = `-`;
    markdown += `| **総合** | **1日の総合評価** | **${totalConvertedScoreText}** | **${totalScore}** |\n`;
    return markdown;
}
