# UI Visual Design — Spec (Delta)

## MODIFIED Requirements

### Requirement: 五十音字卡 3D 翻轉

字卡 SHALL 使用 CSS 3D 翻轉動畫，romaji 與行名在卡片反面內部淡入顯示。

#### Scenario: 詳細資訊位置
- **WHEN** 卡片翻轉完成
- **THEN** romaji 與行名顯示在卡片反面內部（非卡片外部）

#### Scenario: 淡入效果
- **WHEN** romaji 淡入時
- **THEN** 僅有 opacity 變化，不伴隨位移動畫

#### Scenario: 操作按鈕佔位
- **WHEN** 卡片尚未翻轉
- **THEN** 「需加強」與「已熟悉」按鈕始終佔據版面空間（opacity 為 0），不造成 layout shift

#### Scenario: 操作按鈕顯示
- **WHEN** 卡片翻轉後 romaji 淡入
- **THEN** 操作按鈕同步以 opacity 過渡顯示

## ADDED Requirements

### Requirement: 場景角色名稱

對話中非使用者的角色 SHALL 根據場景顯示對應稱呼與圖示，而非統一顯示「店員」。

#### Scenario: 點餐場景
- **WHEN** 場景為「點餐」
- **THEN** 對方角色顯示為「🧑‍💼 店員」

#### Scenario: 住宿場景
- **WHEN** 場景為「住宿」
- **THEN** 對方角色顯示為「🛎️ 櫃檯人員」

#### Scenario: 購物場景
- **WHEN** 場景為「購物」
- **THEN** 對方角色顯示為「🧑‍💼 店員」

#### Scenario: 交通場景
- **WHEN** 場景為「交通」
- **THEN** 對方角色顯示為「🧑‍✈️ 站務員」
