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

    return {
        markdown: convertToMarkdown(formattedData),
        json: {
            items: formattedData
        }
    };
}

/**
 * データをMarkdown文章形式に変換する
 * @param {Array} items - 変換するデータ配列
 * @returns {string} Markdown形式の文字列
 */
function convertToMarkdown(items) {
    let markdown = '';
    
    items.forEach(item => {
        const { 項目, データ } = item;
        let text = '';

        switch (項目) {
            case '起床':
                text = `${item.時}時${item.分}分に起床`;
                break;

            case '散歩':
                text = `犬${データ.犬.数}匹と散歩（${データ.犬.備考}）`;
                break;

            case '朝食':
                text = `${データ.含まれる栄養の色数}色の栄養を含む朝食`;
                break;

            case '体操':
                text = データ ? '体操した' : '体操しなかった';
                break;

            case '労働':
                text = `労働の質: ${データ.質}、自己管理: ${データ.自己管理}（${データ.備考}）`;
                break;

            case 'ジム':
                text = データ.スケジュールに従った ? 'スケジュール通りにジムへ行った' : 'ジムをサボった';
                break;

            case '勉強会':
            case '個人開発':
            case '歯磨き':
                text = `${項目}を${データ ? '行った' : '行わなかった'}`;
                break;

            default:
                // その他の項目
                text = `${データ.題目}（得点: ${データ.得点}）`;
                break;
        }

        markdown += `- ${text}\n`;
    });

    return markdown;
}
