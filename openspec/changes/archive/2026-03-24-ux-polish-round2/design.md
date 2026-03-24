# UX Polish Round 2 — Design

## Context

承接 glassmorphism 改版，使用者實際操作後回饋的三個體驗問題。

## Goals

- romaji 資訊在卡片內，視覺上屬於同一張卡
- 消除字卡翻轉時的 layout shift 抖動
- 對話角色稱呼因場景而異，更貼近真實情境

## Non-Goals

- 不修改翻轉動畫本身（3D perspective 不變）
- 不新增場景或對話內容

## Decisions

### D1: romaji 放回卡片內
- **選擇**：移入 `kana-card__back` div 內，保留 `<Transition>` 淡入
- **理由**：使用者期望翻轉結果在卡片上，而非卡片外；淡入保留是因為 romaji 不應跟著 3D 翻轉同步出現

### D2: 按鈕佔位
- **選擇**：移除 `<Transition>` + `v-if`，改為 `opacity-0 pointer-events-none` 控制
- **替代方案**：用 `v-show`（仍有初始渲染問題）、用 `min-height` 預留空間
- **理由**：`opacity` 方案最簡潔，按鈕始終在 DOM 中佔位，零 layout shift

### D3: 場景角色名稱
- **選擇**：在 `ScenarioMeta` 加 `staffLabel` + `staffIcon`，view 層動態讀取
- **替代方案**：在 JSON 資料中每句 phrase 標註角色名
- **理由**：同場景角色固定，放在 meta 最省事；未來若需要每句不同角色再改 phrase 級別
