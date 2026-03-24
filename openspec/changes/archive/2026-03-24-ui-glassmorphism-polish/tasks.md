# UI Glassmorphism Polish — Tasks

## 1. CSS 基礎設施

- [x] 1.1 CSS 變數改為 rgba 半透明（`--color-card`、`--color-border`）
- [x] 1.2 新增 `--color-card-hover`、`--color-bg-end` 變數
- [x] 1.3 深色模式色彩方案改為深藍調（`#1a1a2e` / `#16213e`）
- [x] 1.4 body `font-size: 1.2em`
- [x] 1.5 body 背景改為 `linear-gradient(135deg)` 漸層
- [x] 1.6 新增 `.glass` class（backdrop-filter + 半透明 + inset shadow）
- [x] 1.7 新增 `.bg-decor` 裝飾色球（`::before` / `::after` 偽元素）

## 2. 深色模式 hover 修正

- [x] 2.1 ScenarioView 按鈕 hover 改用 `hover:bg-(--color-card-hover)`
- [x] 2.2 移除所有寫死的 `hover:bg-gray-50`、`active:bg-gray-100`

## 3. Glassmorphism 套用

- [x] 3.1 App.vue header 改用 `.glass`
- [x] 3.2 HomeView 場景卡片改用 `.glass` + hover
- [x] 3.3 KanaHomeView 功能卡片改用 `.glass` + hover
- [x] 3.4 KanaPracticeView 字卡改用 `.glass`
- [x] 3.5 KanaQuizView 題目卡 + 結果卡改用 `.glass`
- [x] 3.6 KanaChartView toggle 按鈕 inactive 狀態改用 `.glass`
- [x] 3.7 ScenarioView 對話列表卡片改用 `.glass`
- [x] 3.8 PhraseView 跟讀卡片改用 `.glass`
- [x] 3.9 DialogView 完成區塊改用 `.glass`

## 4. Cursor pointer

- [x] 4.1 所有 view 的可點擊 `<button>` 加上 `cursor-pointer`
- [x] 4.2 SlotPicker 按鈕加上 `cursor-pointer`

## 5. 下拉選單修正

- [x] 5.1 SlotPicker dropdown 改用 `bg-white/95 dark:bg-gray-900/95` + `backdrop-blur-xl`

## 6. 五十音字卡翻轉動畫

- [x] 6.1 加入 `perspective` + `rotateY` 3D 翻轉 CSS
- [x] 6.2 正面：假名 + 提示文字
- [x] 6.3 反面：假名（隨卡翻轉）
- [x] 6.4 romaji + 行名改為翻轉後延遲淡入（不跟著翻轉）
- [x] 6.5 操作按鈕（需加強/已熟悉）也跟著淡入

## 7. 深淺色切換動畫

- [x] 7.1 使用 View Transitions API 實作圓形 clip-path 展開
- [x] 7.2 從按鈕點擊位置計算展開半徑
- [x] 7.3 圖示旋轉動畫（spin-in keyframe）
- [x] 7.4 Fallback：不支援時直接切換（無動畫）
- [x] 7.5 雙向動畫修正：light→dark 圓形展開（`vt-expand`）、dark→light 圓形收縮（`vt-shrink`）
- [x] 7.6 以 `vt-to-dark` / `vt-to-light` class 標記切換方向，transition 結束後清除
