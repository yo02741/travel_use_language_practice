# UX Polish Round 2

## Why

前一輪 glassmorphism 改版後，使用者回饋三個問題：
1. 五十音字卡翻轉後 romaji / 行名應在卡片「內部」而非卡片下方
2. 操作按鈕（需加強 / 已熟悉）淡入時因 `v-if` 動態插入，導致下方元素抖動（layout shift）
3. 對話場景中「店員」稱呼不精確 — 交通場景應為「站務員」、住宿場景應為「櫃檯人員」

## What Changes

1. **字卡 romaji 移入卡片反面** — romaji 與行名從卡片外部移至 `kana-card__back` 內，保留淡入動畫但去除 `translateY` 上移
2. **按鈕佔位防抖** — 操作按鈕改為始終佔位（`opacity` 控制顯隱），不再用 `v-if` / `<Transition>` 動態插入
3. **場景角色名稱** — `ScenarioMeta` 新增 `staffLabel` + `staffIcon` 欄位，各場景顯示對應角色稱呼

## Capabilities

### Modified
- 五十音字卡反面佈局（romaji 在卡片內）
- 操作按鈕顯隱機制（opacity 取代 v-if）
- ScenarioMeta 型別（新增 staffLabel / staffIcon）
- PhraseView、DialogView 角色標籤（動態讀取場景設定）

## Impact

- **檔案影響**：`KanaPracticeView.vue`、`types/scenario.ts`、`PhraseView.vue`、`DialogView.vue`
- **破壞性**：無，純 UI 調整
