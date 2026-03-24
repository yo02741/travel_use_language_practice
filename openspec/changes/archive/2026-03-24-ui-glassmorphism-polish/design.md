# UI Glassmorphism Polish — Design

## Context

專案為旅遊語言練習 PWA，使用 Vue 3 + Tailwind CSS 4。原本採用純色背景 + 實色卡片設計，視覺較為平淡。使用者希望提升設計感，並修正深色模式下的互動問題。

## Goals

- 修正深色模式下 hover/active 狀態的視覺一致性
- 透過 glassmorphism 提升整體設計質感與層次
- 為關鍵互動（字卡翻轉、主題切換）加入有意義的動畫
- 全站字體放大 1.2 倍提升可讀性

## Non-Goals

- 不重新設計資訊架構或頁面佈局
- 不引入新的 CSS 框架或動畫庫
- 不改變功能邏輯

## Decisions

### D1: 玻璃感實作方式
- **選擇**：自定義 `.glass` CSS class + CSS 變數改為 rgba
- **替代方案**：Tailwind plugin、每個元件單獨加 utility class
- **理由**：一個 class 統一管理最簡潔，修改時只需改一處

### D2: 背景裝飾
- **選擇**：CSS `::before`/`::after` 偽元素 + `filter: blur(80px)` 的色球
- **替代方案**：SVG 背景、Canvas、圖片
- **理由**：純 CSS 實作，無額外資源載入，效能好

### D3: 字卡翻轉動畫
- **選擇**：CSS `perspective` + `transform: rotateY(180deg)`，romaji/row 用 absolute 定位 + 翻轉後延遲淡入
- **替代方案**：JS 動畫庫、純 opacity 切換
- **理由**：CSS 3D 翻轉最自然，且 romaji 不跟著翻轉更直觀

### D4: 主題切換動畫
- **選擇**：View Transitions API（`document.startViewTransition`）圓形 clip-path 雙向動畫
- **替代方案**：全頁 opacity 漸變、無動畫、僅單向展開
- **理由**：圓形展開從按鈕位置擴散最有設計感，且有 fallback 不影響不支援的瀏覽器
- **雙向策略**：light→dark 時 new snapshot 展開蓋住 old；dark→light 時 old snapshot 收縮露出 new。以 `vt-to-dark` / `vt-to-light` CSS class 標記方向，transition 結束後清除

### D5: 下拉選單不透明
- **選擇**：`bg-white/95 dark:bg-gray-900/95` + `backdrop-blur-xl`
- **理由**：下拉選單需要清楚閱讀內容，不適合用半透明玻璃感

## Risks / Trade-offs

- `backdrop-filter` 在部分低階 Android 裝置可能不支援或效能差，但目標用戶主要為行動裝置中高階機型
- View Transitions API 目前僅 Chromium 瀏覽器支援（Chrome、Edge），Safari/Firefox 用戶會得到無動畫的即時切換（graceful degradation）
- `font-size: 1.2em` 可能導致部分緊湊佈局溢出，但目前頁面結構簡單，影響有限
