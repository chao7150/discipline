import { compile } from "json-schema-to-typescript";
import * as fs from "fs/promises";
import * as path from "path";

async function main() {
  try {
    // スキーマファイルを読み込み
    const schemaPath = path.join(process.cwd(), "schemas", "tasklist.json");
    const schema = JSON.parse(await fs.readFile(schemaPath, "utf-8"));

    // TypeScript型定義を生成
    const ts = await compile(schema, "TaskList", {
      bannerComment: "",
      style: {
        printWidth: 120,
        singleQuote: true,
      },
      additionalProperties: false,
      unreachableDefinitions: false,
    });

    // 出力ディレクトリを作成
    const outputDir = path.join(process.cwd(), "src", "definitions");
    await fs.mkdir(outputDir, { recursive: true });

    // 型定義ファイルを保存
    const outputPath = path.join(outputDir, "tasklist.ts");
    await fs.writeFile(outputPath, ts);

    console.log("型定義ファイルを生成しました:", outputPath);
  } catch (error) {
    console.error("エラーが発生しました:", error);
    process.exit(1);
  }
}

main();
