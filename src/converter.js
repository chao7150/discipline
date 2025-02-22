/**
 * Markdownテーブル変換モジュール
 */

/**
 * JSONデータをMarkdown表形式に変換する
 * @param {Object} data - 変換するJSONデータ
 * @returns {string} Markdown形式の文字列
 */
export function convertToMarkdown(data) {
    let markdown = '| 項目 | 得点 |\n| ---- | ---- |\n';

    // 必須項目の処理
    const requiredItems = ['起床', '散歩', '朝食', '体操', '労働', 'ジム', '勉強会', '個人開発', '歯磨き'];
    requiredItems.forEach(item => {
        const score = calculateScore(data[item]);
        markdown += `| ${item} | ${score} |\n`;
    });

    // その他の項目の処理
    if (data.その他 && Array.isArray(data.その他)) {
        data.その他.forEach(item => {
            markdown += `| ${item.題目} | ${item.得点} |\n`;
        });
    }

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
