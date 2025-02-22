# Daily Tasks

日々のタスク管理と得点化システム

## 機能

- JSONエディタによるタスク入力
- Markdown形式での出力
- JSON形式での出力（得点計算付き）

## 使い方

1. サーバーの起動:
```bash
npm run dev
```

2. ブラウザで以下のURLにアクセス:
```
http://localhost:3000
```

3. JSONエディタでタスクを入力し、「出力」ボタンをクリックすると以下の形式で結果が表示されます:
- Markdown形式のテーブル
- JSON形式（得点計算結果を含む）

## 開発

### プロジェクト構造

```
.
├── index.html          # メインのHTML
├── src/
│   └── converter.js    # データ変換モジュール
├── schemas/
│   └── tasklist.json   # JSONスキーマ定義
└── example/
    └── table.md        # 出力例
```

### 技術スタック

- Node.js (開発サーバー)
- [JSON Editor](https://github.com/json-editor/json-editor)
- ES Modules

### 開発ツール

このプロジェクトは [Cline](https://github.com/saoudrizwan/cline) + [Claude](https://www.anthropic.com/claude) を使用して開発されました。
