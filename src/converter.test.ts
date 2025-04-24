import assert from "assert";
import { 労働Formatter, 起床Formatter, 散歩Formatter, 朝食の栄養カバレッジFormatter, 体操Formatter, ジムFormatter, 勉強会Formatter, 個人開発Formatter, あすけんFormatter } from "./converter.ts";

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
    "した・passion: 50点, discipline: 40点（特記事項あり）",
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
    "した・passion: 50点, discipline: 40点",
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
  const result = 起床Formatter.文言を得る({ 時: 7, 分: 5 });
  assert.strictEqual(result, "7:05", "起床Formatterの基本動作");
}

function test散歩Formatter() {
  const result = 散歩Formatter.文言を得る({ 実施: true, ゴミ拾い: true });
  assert.strictEqual(result, "実施・ゴミ拾いあり", "散歩Formatterの実施あり");
  const result2 = 散歩Formatter.文言を得る({ 実施: false, ゴミ拾い: false });
  assert.strictEqual(result2, "ノー", "散歩Formatterの実施なし");
}

function test朝食の栄養カバレッジFormatter() {
  const result = 朝食の栄養カバレッジFormatter.文言を得る("3");
  assert.strictEqual(result, "3色カバー", "朝食の栄養カバレッジFormatterの基本動作");
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
