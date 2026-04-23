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
│   ├── CheatSheet.tsx     # チートシートタブ
│   ├── PracticeMode.tsx   # 練習モードタブ
│   ├── PracticeLog.tsx    # ログタブ
│   └── TabNav.tsx         # タブナビゲーション
├── data/
│   └── tips.ts            # 8つのプロンプト原則データ
├── hooks/
│   └── usePracticeLog.ts  # ログのstate管理
├── lib/
│   └── anthropic.ts       # API呼び出し
└── App.tsx
```

## Rules
- 機能追加・修正後は必ず git add . && git commit && git push まで実行する
- コンポーネントは必ずsrc/components/に分割する（App.tsxに書かない）
- APIキーは .env ファイルの VITE_ANTHROPIC_API_KEY から読む（ハードコードしない）
- わからないことがあれば実装前に確認する。推測で進めない。

## What NOT to do
- App.tsxに全部書かない
- console.logをそのままコミットしない
- package.jsonを無断で大量追加しない

## Key Features
1. チートシート：8原則をカード表示、クリックでBefore/After展開、Markdownエクスポート
2. 練習モード：シナリオ選択 → プロンプト入力 → Claude APIで採点
3. ログ：過去の練習履歴をlocalStorageに保存・表示・Markdownエクスポート
