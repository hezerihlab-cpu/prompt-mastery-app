# Prompt Mastery App

## Project Overview
プロンプト設計を学ぶための練習アプリ。
チートシート・練習モード・ログ機能の3タブ構成。
Anthropic APIを使ってプロンプトの採点フィードバックを返す。

## Tech Stack
- Vite + React (TypeScript)
- TailwindCSS
- Anthropic SDK（@anthropic-ai/sdk）

## GitHub
- repo: github.com/[YOUR_USERNAME]/prompt-mastery-app
- branch: main
- commit message: 日本語でOK、変更内容を簡潔に

## Directory Structure
```
src/
├── components/
│   ├── CheatSheet.tsx
│   ├── PracticeMode.tsx
│   ├── PracticeLog.tsx
│   └── TabNav.tsx
├── data/
│   └── tips.ts       ← 以下のデータをそのまま使う
├── hooks/
│   └── usePracticeLog.ts
├── lib/
│   └── anthropic.ts
└── App.tsx
```

---

## チートシートの中身（これをそのまま実装する）

以下の8原則をカード表示する。カードをクリックするとBefore/Afterが展開する。

```ts
// src/data/tips.ts
export const TIPS = [
  {
    num: "01",
    title: "制約と自由度を分ける",
    sub: "固定すべきものと、AIに任せるものを分けて書く",
    bad: "このコードをリファクタリングして読みやすくしてコメントも入れてテストも書いて",
    good: "【固定】TypeScript、関数型スタイル 【自由】構造・命名・コメントスタイル"
  },
  {
    num: "02",
    title: "「何のため」を渡す",
    sub: "目的を書くとAIが最適な手段を選ぶ",
    bad: "このコードにコメントを追加して",
    good: "初めてこのコードを読む人が10分で理解できるようにコメントを追加して"
  },
  {
    num: "03",
    title: "例示は最強の制約",
    sub: "説明100文字より例1つの方が精度が高い",
    bad: "カジュアルで親しみやすいトーンで書いて",
    good: "このトーンで書いて：「今日は天気いいけど、なんか気持ち乗らない日ってあるよね」"
  },
  {
    num: "04",
    title: "ネガ指示は最後に",
    sub: "ポジ指示を先に書き、禁止事項は末尾に置く",
    bad: "箇条書きにしないで難しい言葉も使わないで長くもしないで説明して",
    good: "中学生向け、会話調で説明して。箇条書きは使わない。"
  },
  {
    num: "05",
    title: "段階的に絞り込む",
    sub: "一発完成を狙わず、方向→選択→実装の3段階で",
    bad: "ECサイトを全部設計して実装して",
    good: "1回目：方向性3案 → 2回目：選択して深掘り → 3回目：実装"
  },
  {
    num: "06",
    title: "メタ指示を入れる",
    sub: "答える前に確認させる / 途中停止点を作る",
    bad: "（指示なしで全部一気にやらせる）",
    good: "まず方針を箇条書きで出して。OKなら実装して。"
  },
  {
    num: "07",
    title: "ロールより文脈",
    sub: "職業ラベルより「場面＋視点」が精度が高い",
    bad: "あなたはプロのエンジニアです",
    good: "セキュリティを重視するシニアエンジニアのコードレビューの場面として見て"
  },
  {
    num: "08",
    title: "AIの自信を疑う",
    sub: "数字・最新情報・APIの細かい仕様は必ず外部確認",
    bad: "（数字や最新情報をそのまま信用する）",
    good: "具体的な数字/最新情報/ライブラリのAPIは外部ソース確認必須"
  }
];
```

---

## 練習モードのシナリオ（これをそのまま実装する）

```ts
// src/data/tips.ts に追記
export const SCENARIOS = [
  { id: "web",     label: "Webアプリ開発", desc: "コンポーネント設計・実装依頼" },
  { id: "design",  label: "デザイン指示",   desc: "UI/UXの方向性を伝える" },
  { id: "review",  label: "コードレビュー", desc: "コードの問題点を指摘させる" },
  { id: "learn",   label: "学習・説明",     desc: "概念や技術を教えてもらう" },
  { id: "content", label: "コンテンツ生成", desc: "文章・コピーを書かせる" },
  { id: "debug",   label: "デバッグ",       desc: "バグの原因を探る" }
];
```

---

## 練習モードのAI採点ロジック（このsystem promptをそのまま使う）

```ts
// src/lib/anthropic.ts
const SYSTEM_PROMPT = `あなたはプロンプト設計の専門家です。ユーザーが書いたAIへのプロンプトを評価し、以下の観点で採点・改善案を返してください。

観点：
1. 目的の明確さ（何のためかが伝わるか）
2. 制約と自由度のバランス（固定すべきものが明示されているか）
3. 曖昧さの排除（余分な解釈を生まないか）
4. 例示・文脈の質（例や場面が提供されているか）

返答形式：
- 総合評価：A/B/C/D
- 良い点：1〜2点
- 改善点：1〜2点
- 改善後のプロンプト案：（具体的に書き直す）

簡潔に、日本語で返答してください。`;
```

---

## 各タブの仕様

### タブ1：チートシート
- 8枚のカードをグリッド表示（2〜3列、レスポンシブ）
- カードクリックでBefore / Afterを展開・折りたたみ
- 右下に「Markdownでエクスポート」ボタン → 8原則をmd形式でダウンロード

### タブ2：練習モード
- シナリオを選択（6種）
- テキストエリアにプロンプトを入力
- 「AIに採点してもらう」ボタンでClaude APIを呼ぶ
- フィードバックをテキストで表示
- 採点完了時にlocalStorageへログ保存

### タブ3：練習ログ
- localStorageから履歴を読み込んで表示
- 各ログに：日時・シナリオ名・書いたプロンプト・フィードバックを表示
- 「Markdownでエクスポート」ボタンで全ログをmd形式でダウンロード

---

## 環境変数
```
VITE_ANTHROPIC_API_KEY=your_key_here
```

.env.example をコミットに含めること。

---

## Rules
- データ（TIPS・SCENARIOS・SYSTEM_PROMPT）はこのファイルに定義してあるものをそのまま使う。内容を改変・追加しない。
- 機能追加・修正後は必ず git add . && git commit && git push まで実行する
- APIキーは .env から読む。ハードコードしない。
- 不明点は実装前に確認する。推測で進めない。

## What NOT to do
- TIPSやSCENARIOSの内容を自分で考えて書き換えない
- App.tsxに全ロジックをまとめない
- console.logをそのままコミットしない
