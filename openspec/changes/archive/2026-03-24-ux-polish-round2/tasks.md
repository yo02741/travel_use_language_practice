# UX Polish Round 2 — Tasks

## 1. 字卡 romaji 移入卡片

- [x] 1.1 將 romaji + 行名的 `<Transition>` 區塊從卡片外移入 `kana-card__back` 內
- [x] 1.2 移除淡入動畫的 `translateY(8px)` 上移效果（純 opacity）

## 2. 佔位防抖 + 內容時序

- [x] 2.1 操作按鈕移除 `<Transition>` + `v-if`
- [x] 2.2 改用 `opacity-0 pointer-events-none` / `opacity-100` 控制顯隱
- [x] 2.3 加上 `transition-opacity duration-300` 平滑過渡
- [x] 2.4 卡片內 romaji 也改為 opacity 佔位（移除 `<Transition>` + `v-if`）
- [x] 2.5 換題時序：等翻轉動畫結束（620ms）後才更新 `currentIdx`，避免翻轉中看到下一題答案

## 3. 場景角色名稱

- [x] 3.1 `ScenarioMeta` interface 新增 `staffLabel: string` + `staffIcon: string`
- [x] 3.2 `SCENARIOS` 常數填入各場景角色：點餐（店員）、住宿（櫃檯人員）、購物（店員）、交通（站務員）
- [x] 3.3 PhraseView 角色標籤改為 `scenario?.staffIcon + scenario?.staffLabel`
- [x] 3.4 DialogView 角色標籤改為 `scenario?.staffIcon + scenario?.staffLabel`
