# UI Glassmorphism Polish

## Why

使用者在深色模式下操作時，hover 狀態的文字顏色沒有對應變化（使用了寫死的亮色 class 如 `hover:bg-gray-50`）。整體視覺缺乏設計感：純色背景單調、卡片缺乏層次、字體偏小、按鈕缺少 cursor pointer、五十音字卡沒有翻轉動畫、深淺色切換太生硬。

## What Changes

1. **深色模式 hover 修正** — 將所有寫死的亮色 hover/active class 改為 CSS 變數驅動，自動適配深淺色
2. **字體放大 1.2 倍** — 全站 body `font-size: 1.2em`
3. **背景漸層 + 裝飾色球** — 背景改為對角漸層，加上兩個模糊色球（紫/綠），深色模式自動降低透明度
4. **Glassmorphism 玻璃感** — 新增 `.glass` class（半透明背景 + backdrop-filter blur + inset shadow），所有卡片、header 統一套用
5. **Cursor pointer** — 所有可點擊的 `<button>` 加上 `cursor-pointer`
6. **下拉選單不透明** — SlotPicker dropdown 改用高不透明度背景，避免透視到下層內容
7. **五十音字卡 3D 翻轉** — 使用 CSS `perspective` + `rotateY` 實作真實翻轉動畫，romaji 與行名改為翻轉後淡入（不隨卡片翻轉）
8. **深淺色切換動畫** — 使用 View Transitions API 實作圓形展開效果，圖示旋轉動畫

## Capabilities

### New
- Glassmorphism 設計系統（`.glass` class）
- 背景裝飾層（`.bg-decor`）
- 3D 卡片翻轉動畫
- View Transition 圓形展開主題切換

### Modified
- CSS 變數系統（`--color-card` / `--color-border` 改為 rgba 半透明）
- 深色模式色彩方案（改為深藍色調）
- 所有 view 的卡片與按鈕樣式

## Impact

- **檔案影響**：`main.css`、`App.vue`、所有 views（8 個）、`SlotPicker.vue`
- **效能**：`backdrop-filter` 在低階設備可能有 GPU 負擔，但 `blur(16px)` 是合理範圍
- **相容性**：View Transitions API 僅 Chromium 支援，已加入 fallback（無動畫直接切換）
