## Context

全新專案，目標是在 4 週內（3/24 → 4/17）完成一個旅遊語言練習 PWA，供自用與家人使用。使用者為台灣旅日族，需要在出發前短期集中練習日英混用的旅遊溝通。專案已使用 create-vue 初始化，包含 Vue3 + TypeScript + Vite + Vue Router + Pinia + Vitest + Playwright 腳手架。

## Goals / Non-Goals

**Goals:**

- 提供手機優先、簡約有設計感的 PWA 體驗
- 4 大場景 × 30 組對話的完整學習內容
- 兩階段學習流程（跟讀 → 模擬對話）流暢切換
- 五十音字卡記憶遊戲
- 離線可用、零後端依賴
- 4 週內可交付

**Non-Goals:**

- 使用者帳號系統或雲端同步
- AI 動態對話生成（v1 不做）
- 語音辨識或發音評分
- 多國語言支援（v1 僅日文 + 英文）
- 社群功能或排行榜

## Decisions

### 1. 純前端 PWA 架構

**選擇**：Vue3 + Vite + Tailwind CSS，靜態部署至 Vercel

**替代方案**：
- Vue3 + Firebase：增加複雜度但無明確收益，自用不需雲端
- React Native / Flutter：原生 APP 開發週期過長，4 週內無法完成

**理由**：自用 + 家人場景下，PWA 加到主畫面即可當 APP 使用。無後端 = 零維護成本、零執行成本。Vercel 免費方案綽綽有餘。

### 2. 內容儲存為靜態 JSON

**選擇**：所有對話腳本以 JSON 檔打包進前端，按場景分檔

**替代方案**：
- 嵌入 SQLite (sql.js)：過度設計
- 外部 CMS：增加依賴，不符合離線需求

**理由**：120 組固定對話的資料量極小（預估 < 500KB），直接 import JSON 最簡單。未來若需新增場景，只需新增 JSON 檔案。

**資料結構**：
```
src/data/
├── scenarios/
│   ├── dining.json        # 點餐 30 組
│   ├── accommodation.json # 住宿 30 組
│   ├── shopping.json      # 購物 30 組
│   └── transportation.json # 交通 30 組
└── kana/
    ├── hiragana.json      # 平假名
    └── katakana.json      # 片假名
```

**對話 JSON 結構**：
```json
{
  "id": "dining-01",
  "title": "拉麵店基本點餐",
  "difficulty": 1,
  "phrases": [
    {
      "speaker": "you",
      "japanese": { "text": "すみません", "reading": "すみません", "romaji": "sumimasen" },
      "english": "Excuse me",
      "chinese": "不好意思"
    },
    {
      "speaker": "staff",
      "japanese": { "text": "いらっしゃいませ！何名様ですか？", "reading": "いらっしゃいませ！なんめいさまですか？", "romaji": "irasshaimase! nanmei-sama desu ka?" },
      "english": "Welcome! How many people?",
      "chinese": "歡迎光臨！請問幾位？"
    }
  ]
}
```

### 3. 進度儲存使用 localStorage

**選擇**：localStorage 儲存學習進度

**替代方案**：
- IndexedDB：API 複雜，進度資料量小不需要
- Cookie：容量限制且不適合

**理由**：進度資料結構簡單（哪些對話已完成、五十音熟練度），localStorage 完全足夠。自用不需跨裝置同步。

**與 Pinia 的搭配**：Pinia 負責 runtime 狀態管理（場景資料載入、當前學習狀態、UI 狀態），localStorage 負責持久化。Pinia store 初始化時從 localStorage 讀取，狀態變更時同步寫入。

### 4. 頁面路由結構

**選擇**：Vue Router，SPA 架構

**路由規劃**：
```
/                      # 首頁（場景選擇）
/scenario/:id          # 場景對話列表
/scenario/:id/phrase/:n # 跟讀練習
/scenario/:id/dialog/:n # 模擬對話
/kana                  # 五十音遊戲首頁
/kana/:type            # 平假名 or 片假名練習
```

### 5. 設計風格

**選擇**：簡約日式風格，手機優先 RWD

**RWD 目標裝置**：iPhone 12 ~ iPhone 17 Pro（螢幕寬度 375px ~ 402px），同時兼顧平板與桌面。

**配色方向**：淺色系為主，搭配日式色彩點綴（如：藍灰、淡粉、抹茶綠）。每個場景使用不同主題色以利識別。

**字型**：日文內容使用 Noto Sans JP，中文使用 Noto Sans TC，確保假名與漢字顯示正確。

## Risks / Trade-offs

- **內容品質**：120 組對話的日文正確性需要驗證 → 可請懂日文的朋友幫忙校對，或參考既有旅遊會話書籍
- **無語音功能**：v1 沒有發音播放 → 使用者需自行查發音，可考慮 v2 加入 Web Speech API
- **localStorage 限制**：清除瀏覽器資料會遺失進度 → 自用場景可接受，未來可加匯出功能
- **PWA 離線體驗**：需正確設定 Service Worker → Vite PWA plugin 可處理
