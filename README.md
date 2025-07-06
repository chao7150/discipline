# Daily Tasks

日々のタスク管理と得点化システム

## 概要

Daily Tasksは、毎日の習慣や活動を記録し、自動的に点数化するWebアプリケーションです。起床時間、睡眠時間、運動、食事、仕事など11項目の活動を入力すると、それぞれの活動に応じた得点と重み付けによる総合点が計算されます。

## 機能

- JSONエディタによるタスク入力
- Markdown形式での出力（GitHubでの記録に便利）
- 各活動の重み付けによる総合評価
- クリップボードへのコピー機能
- GitHubリポジトリとの連携
- iframe埋め込み用コードの自動生成（ブログ等への埋め込み）

## 使い方

1. サーバーの起動:
```bash
npm run dev
```

2. ブラウザで以下のURLにアクセス:
```
http://localhost:3000
```

3. JSONエディタでタスクを入力し、「出力」ボタンをクリックするとMarkdown形式のテーブルが表示されます

## iframe埋め込み

ブログなどに結果の表を埋め込むことができます。

### 使用方法

1. メインページ（`index.html`）でタスクデータを入力
2. 「出力」ボタンをクリック
3. 「ブログ埋め込み用」セクションに表示されるiframeコードをコピー
4. ブログにそのまま貼り付け

iframeコードは自動的に以下の形式で生成されます：

```html
<iframe 
    src="https://your-domain.com/embed.html?data=BASE64_ENCODED_DATA"
    width="100%"
    height="400"
    frameborder="0">
</iframe>
```

技術的な詳細は `embed-example.html` を参照してください。

## 開発

### プロジェクト構造

```
.
├── index.html          # メインのHTML
├── src/
│   └── converter.js    # データ変換モジュール
├── scripts/
│   └── server.js       # 開発サーバー
├── schemas/
│   └── tasklist.json   # JSONスキーマ定義
└── example/
    └── table.md        # 出力例
```

### 評価項目と配点

| 項目 | 評価方法 | 重み |
|------|----------|------|
| 睡眠時間 | 4.5〜7時間で線形増加（7時間で100点） | 12 |
| 起床 | 5〜10時で山型配点（7-8時が100点） | 8 |
| 散歩 | 実施有無（0 or 100点） | 5 |
| 朝食 | 栄養カバレッジ0〜3色で段階評価 | 4 |
| 体操 | 実施有無（0 or 100点） | 5 |
| 労働 | passionとdisciplineの平均、休日は100点 | 24 |
| ジム | 実施有無（0 or 100点） | 11 |
| 勉強会 | 実施有無（0 or 100点） | 12 |
| 個人開発 | 実施有無（0 or 100点） | 7 |
| あすけん | 実施有無（0 or 100点） | 9 |
| 体重測定 | 実施有無（0 or 100点） | 3 |

### 技術スタック

- TypeScript
- Node.js (開発サーバー)
- [JSON Editor](https://github.com/json-editor/json-editor)
- ES Modules
- Bootstrap 4

### 開発ツール

このプロジェクトは [Cline](https://github.com/saoudrizwan/cline) + [Claude](https://www.anthropic.com/claude) を使用して開発されました。
