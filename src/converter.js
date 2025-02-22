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
    
    // データの整形
    const formattedData = requiredItems.map(item => {
        if (item === '起床') {
            return {
                項目: item,
                時: data[item].時,
                分: data[item].分
            };
        } else {
            return {
                項目: item,
                データ: data[item]
            };
        }
    });

    // その他の項目の追加
    if (data.その他 && Array.isArray(data.その他)) {
        data.その他.forEach(item => {
            formattedData.push({
                項目: item.題目,
                データ: item
            });
        });
    }

    // 総合点の計算
    const weights = {
        '起床': 0.15,
        '散歩': 0.10,
        '朝食': 0.15,
        '体操': 0.05,
        '労働': 0.25,
        'ジム': 0.10,
        '勉強会': 0.05,
        '個人開発': 0.10,
        '歯磨き': 0.05
    };

    const scores = formattedData.map(item => {
        if (item.項目 === '起床') {
            return calculateScore(item.項目, item) * weights[item.項目];
        }
        return calculateScore(item.項目, item.データ) * (weights[item.項目] || 0);
    });

    const totalScore = Math.round(scores.reduce((sum, score) => sum + score, 0));

    return {
        markdown: convertToMarkdown(formattedData, totalScore),
        json: {
            items: formattedData,
            totalScore
        }
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
        case '起床': {
            // 5時=100点、12時=0点で線形計算
            const 時間 = データ.時 + データ.分 / 60;
            const score = Math.max(0, Math.min(100, (12 - 時間) * (100 / 7)));
            return Math.round(score);
        }

        case '散歩':
            // 犬の数×20点（最大100点）
            return Math.min(100, データ.犬.数 * 20);

        case '朝食':
            // 栄養の色数×20点（最大100点）
            return Math.min(100, データ.含まれる栄養の色数 * 20);

        case '体操':
            // 実施で100点、未実施で0点
            return データ ? 100 : 0;

        case '労働':
            // 質と自己管理の平均点
            return Math.round((データ.質 + データ.自己管理) / 2);

        case 'ジム':
            // スケジュール通りなら100点、サボりで0点
            return データ.スケジュールに従った ? 100 : 0;

        case '勉強会':
        case '個人開発':
        case '歯磨き':
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
    let markdown = '| 項目 | 内容 | 得点 |\n| ---- | ---- | ---- |\n';
    
    items.forEach(item => {
        const { 項目, データ } = item;
        let text = '';
        let score = 0;

        switch (項目) {
            case '起床':
                text = `${item.時}時${item.分}分に起床`;
                score = calculateScore(項目, item);
                break;

            case '散歩':
                text = `犬${データ.犬.数}匹と散歩（${データ.犬.備考}）`;
                score = calculateScore(項目, データ);
                break;

            case '朝食':
                text = `朝食で栄養を${データ.含まれる栄養の色数}色摂取`;
                score = calculateScore(項目, データ);
                break;

            case '体操':
                text = データ ? '体操した' : '体操しなかった';
                score = calculateScore(項目, データ);
                break;

            case '労働':
                text = `仕事の質は${データ.質}点、自己管理は${データ.自己管理}点（${データ.備考}）`;
                score = calculateScore(項目, データ);
                break;

            case 'ジム':
                text = データ.スケジュールに従った ? '予定通りジムで運動' : 'ジムをサボった';
                score = calculateScore(項目, データ);
                break;

            case '勉強会':
            case '個人開発':
            case '歯磨き':
                text = `${項目}を${データ ? '行った' : '行わなかった'}`;
                score = calculateScore(項目, データ);
                break;

            default:
                text = データ.題目;
                score = データ.得点;
                break;
        }

        markdown += `| ${項目} | ${text} | ${score} |\n`;
    });

    markdown += '| **総合** | **1日の総合評価** | **' + totalScore + '** |\n';
    return markdown;
}
