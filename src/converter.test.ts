import assert from "assert";
import {
  労働Formatter,
  起床Formatter,
  散歩Formatter,
  朝食の栄養カバレッジFormatter,
  体操Formatter,
  ジムFormatter,
  勉強会Formatter,
  個人開発Formatter,
  あすけんFormatter,
} from "./converter.ts";

function test労働Formatter() {
  // 備考あり、状態が休日でない場合
  const result = 労働Formatter.文言を得る({
    状態: "した",
    passion: 50,
    discipline: 40,
    備考: "特記事項あり",
  });
  assert.strictEqual(
    result,
    "passion: 50点, discipline: 40点（特記事項あり）",
    "備考ありのとき括弧付きで表示されること"
  );

  // 備考なし、状態が休日でない場合
  const result2 = 労働Formatter.文言を得る({
    状態: "した",
    passion: 50,
    discipline: 40,
    備考: "",
  });
  assert.strictEqual(
    result2,
    "passion: 50点, discipline: 40点",
    "備考なしのとき括弧が表示されないこと"
  );

  // 状態が休日、備考あり
  const result3 = 労働Formatter.文言を得る({
    状態: "休日",
    passion: 0,
    discipline: 0,
    備考: "休暇中",
  });
  assert.strictEqual(result3, "休日（休暇中）", "休日かつ備考ありの表示");

  // 状態が休日、備考なし
  const result4 = 労働Formatter.文言を得る({
    状態: "休日",
    passion: 0,
    discipline: 0,
    備考: "",
  });
  assert.strictEqual(result4, "休日", "休日かつ備考なしの表示");
}

function test起床Formatter() {
  // 文言を得るのテスト
  assert.strictEqual(
    起床Formatter.文言を得る({ 時: 7, 分: 5 }),
    "7:05",
    "起床Formatter.文言を得る: 基本動作"
  );
  assert.strictEqual(
    起床Formatter.文言を得る({ 時: 10, 分: 0 }),
    "10:00",
    "起床Formatter.文言を得る: 0分の場合"
  );

  // 点数を得るのテスト
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 4, 分: 59 }),
    0,
    "起床Formatter.点数を得る: 5時以前"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 5, 分: 0 }),
    0,
    "起床Formatter.点数を得る: 5時ちょうど"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 6, 分: 0 }),
    50,
    "起床Formatter.点数を得る: 5時〜7時の間 (6時)"
  );
   assert.strictEqual(
    起床Formatter.点数を得る({ 時: 6, 分: 30 }),
    75,
    "起床Formatter.点数を得る: 5時〜7時の間 (6時30分)"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 7, 分: 0 }),
    100,
    "起床Formatter.点数を得る: 7時ちょうど"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 7, 分: 30 }),
    100,
    "起床Formatter.点数を得る: 7時〜8時の間 (7時30分)"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 8, 分: 0 }),
    100,
    "起床Formatter.点数を得る: 8時ちょうど"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 9, 分: 0 }),
    50,
    "起床Formatter.点数を得る: 8時〜10時の間 (9時)"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 8, 分: 30 }),
    75,
    "起床Formatter.点数を得る: 8時〜10時の間 (8時30分)"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 10, 分: 0 }),
    0,
    "起床Formatter.点数を得る: 10時ちょうど"
  );
  assert.strictEqual(
    起床Formatter.点数を得る({ 時: 10, 分: 1 }),
    0,
    "起床Formatter.点数を得る: 10時以降"
  );
}

function test散歩Formatter() {
  const result = 散歩Formatter.文言を得る({ 実施: true, ゴミ拾い: true });
  assert.strictEqual(result, "実施・ゴミ拾いあり", "散歩Formatterの実施あり");
  const result2 = 散歩Formatter.文言を得る({ 実施: false, ゴミ拾い: false });
  assert.strictEqual(result2, "ノー", "散歩Formatterの実施なし");
}

function test朝食の栄養カバレッジFormatter() {
  const result = 朝食の栄養カバレッジFormatter.文言を得る("3");
  assert.strictEqual(
    result,
    "3色カバー",
    "朝食の栄養カバレッジFormatterの基本動作"
  );
}

function test体操Formatter() {
  const result = 体操Formatter.文言を得る(true);
  assert.strictEqual(result, "実施", "体操Formatterの実施あり");
  const result2 = 体操Formatter.文言を得る(false);
  assert.strictEqual(result2, "ノー", "体操Formatterの実施なし");
}

function testジムFormatter() {
  const result = ジムFormatter.文言を得る("有酸素");
  assert.strictEqual(result, "有酸素", "ジムFormatterの基本動作");
}

function test勉強会Formatter() {
  const result = 勉強会Formatter.文言を得る(true);
  assert.strictEqual(result, "参加", "勉強会Formatterの参加あり");
  const result2 = 勉強会Formatter.文言を得る(false);
  assert.strictEqual(result2, "ノー", "勉強会Formatterの参加なし");
}

function test個人開発Formatter() {
  const result = 個人開発Formatter.文言を得る(true);
  assert.strictEqual(result, "実施", "個人開発Formatterの実施あり");
  const result2 = 個人開発Formatter.文言を得る(false);
  assert.strictEqual(result2, "ノー", "個人開発Formatterの実施なし");
}

function testあすけんFormatter() {
  const result = あすけんFormatter.文言を得る(0);
  assert.strictEqual(result, "-", "あすけんFormatterの基本動作");
}

test労働Formatter();
test起床Formatter();
test散歩Formatter();
test朝食の栄養カバレッジFormatter();
test体操Formatter();
testジムFormatter();
test勉強会Formatter();
test個人開発Formatter();
testあすけんFormatter();

console.log("すべてのFormatterのテストがすべて成功しました。");

import { convertData } from "./converter.ts";
import type { TaskList } from "./definitions/tasklist.ts";

function testConvertData() {
  const testData: TaskList = {
    睡眠時間: { 時間: 7, 分: 0 },
    起床: { 時: 8, 分: 0 },
    散歩: { 実施: true, ゴミ拾い: true },
    朝食の栄養カバレッジ: "3",
    体操: true,
    労働: { 状態: "した", passion: 80, discipline: 70, 備考: "" },
    ジム: "有酸素+筋トレ",
    勉強会: true,
    個人開発: true,
    あすけん: 85,
  };

  const expectedMarkdown = `| 項目 | 内容 | 得点 | 換算点 |
| ---- | ---- | ---: | ---: |
| 睡眠時間 | 7時間0分 | 100 | 13.0/13.0 |
| 起床 | 8:00 | 100 | 8.0/8.0 |
| 散歩 | 実施・ゴミ拾いあり | 100 | 5.0/5.0 |
| 朝食の栄養カバレッジ | 3色カバー | 100 | 5.0/5.0 |
| 体操 | 実施 | 100 | 5.0/5.0 |
| 労働 | passion: 80点, discipline: 70点 | 75 | 18.0/24.0 |
| ジム | 有酸素+筋トレ | 100 | 12.0/12.0 |
| 勉強会 | 参加 | 100 | 12.0/12.0 |
| 個人開発 | 実施 | 100 | 7.0/7.0 |
| あすけん | - | 85 | 7.7/9.0 |
| **総合** | **1日の総合評価** | **-** | **93** |
`;

  const result = convertData(testData);
  // 改行コードの違いを吸収するために trim() をかける
  assert.strictEqual(
    result.markdown.trim(),
    expectedMarkdown.trim(),
    "convertData の Markdown 出力が期待通りであること"
  );
}

testConvertData();

console.log("convertData のテストが成功しました。");
