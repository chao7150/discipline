/**
 * データ変換モジュール
 */

/**
 * 入力データを整形された形式に変換する
 * @param {Object} data - 変換するJSONデータ
 * @returns {Object} 変換結果（markdown形式とjson形式）
 */
export function convertData(data) {
    const requiredItems = ['起床', '散歩', '朝食', '体操', '労働', 'ジム', '勉強会', '個人開発', '歯磨き'];
    
    // スコア計算と整形されたデータの作成
    const formattedData = requiredItems.map(item => ({
        項目: item,
        得点: calculateScore(data[item])
    }));

    // その他の項目の追加
    if (data.その他 && Array.isArray(data.その他)) {
        data.その他.forEach(item => {
            formattedData.push({
                項目: item.題目,
                得点: item.得点
            });
        });
    }

    // 合計得点の計算
    const totalScore = formattedData.reduce((sum, item) => sum + item.得点, 0);

    return {
        markdown: convertToMarkdown(formattedData),
        json: {
            items: formattedData,
            totalScore
        }
    };
}

/**
 * データをMarkdown表形式に変換する
 * @param {Array} items - 変換するデータ配列
 * @returns {string} Markdown形式の文字列
 */
function convertToMarkdown(items) {
    let markdown = '| 項目 | 得点 |\n| ---- | ---- |\n';
    
    items.forEach(item => {
        markdown += `| ${item.項目} | ${item.得点} |\n`;
    });

    return markdown;
}

/**
 * 項目の得点を計算する
 * @param {*} value - 計算対象の値
 * @returns {number} 計算された得点
 */
function calculateScore(value) {
    if (typeof value === 'boolean') {
        return value ? 100 : 0;
    }
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            return value.reduce((sum, item) => sum + (item.得点 || 0), 0);
        }
        // オブジェクトの場合は全てのプロパティが必須値を満たしていれば100点
        return Object.values(value).every(v => v !== undefined && v !== null) ? 100 : 0;
    }
    return 0;
}
