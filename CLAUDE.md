# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

旅遊語言練習 PWA — 針對台灣旅日族的出發前短期語言集中訓練工具。以日文為學習主軸（同時包含英文），繁體中文為介面語言。純前端架構，無後端。

## Commands

```bash
npm run dev          # 開發伺服器
npm run build        # 型別檢查 + 產出 (vue-tsc + vite build)
npm run build-only   # 僅 vite build（跳過型別檢查）
npm run type-check   # vue-tsc 型別檢查
npm run test:unit    # Vitest 單元測試
npm run test:e2e     # Playwright E2E 測試（首次需 npx playwright install）
npm run lint         # oxlint + eslint（依序執行，含 --fix）
npm run format       # Prettier 格式化 src/
```

## Tech Stack

- Vue 3 + TypeScript + Vite 7
- Vue Router 5, Pinia 3
- Tailwind CSS (待安裝)
- Vitest (unit), Playwright (e2e)
- ESLint (vue + typescript) + oxlint + Prettier
- 部署：Vercel

## Architecture

- `@` alias 指向 `src/`
- 路由：`src/router/index.ts`（Vue Router, history mode）
- 狀態管理：Pinia（`src/stores/`）
- 單元測試放在 `src/**/__tests__/`
- E2E 測試放在 `e2e/`

### 內容資料

所有對話腳本為靜態 JSON，存放於 `src/data/`：
- `scenarios/` — 4 大場景（dining, accommodation, shopping, transportation），每場景 30 組對話
- `kana/` — 五十音資料（hiragana, katakana）

學習進度使用 localStorage 儲存，無後端依賴。

## OpenSpec

專案使用 OpenSpec 管理變更規格。相關文件在 `openspec/` 目錄：
- `openspec/changes/` — 變更提案與任務
- `openspec/specs/` — 功能規格

使用 `/opsx:apply` 開始實作任務。
