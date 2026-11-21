# SafeContract v2｜人人都能懂的交易防詐實驗室

SafeContract 是面向一般民眾的繁體中文互動教育網站，透過生活化網購情境說明交易託管、智慧合約安全與防詐觀念。

## 網站功能

1. 直接付款與條件式託管比較。
2. 自訂商品與模擬交易金額；引導式交易操作與事件紀錄。
3. 六種可操作情境：正常交付、賣方未授權放款、重複付款、逾期退款、爭議仲裁、陌生人冒用。
4. 六項交易前風險檢查清單，提供規則式安全提醒（不是詐騙機率）。
5. 三題互動防詐測驗與答案解析。
6. 學習成果統計、TXT 報告下載、瀏覽器列印／另存 PDF。
7. 手機響應式版面；無須註冊、登入、錢包或 API 金鑰。

## 如何執行

### 最簡單方式（推薦）

在專案資料夾執行：

```bash
python -m http.server 8000
```

在瀏覽器開啟 `http://localhost:8000`。**請勿直接以 `file://` 雙擊 `index.html`**，因為網站使用 ES module 匯入 `src/engine.mjs`，某些瀏覽器會阻擋本機檔案匯入。

### Node.js 自動化測試

需 Node.js 20 以上：

```bash
npm test
```

目前 12 項測試涵蓋 JavaScript 交易狀態機的授權、付款、退款、爭議與輸入驗證。測試並不代表 Solidity 合約已完成編譯、鏈上驗證或安全審計。

## GitHub Pages 部署

1. 在 GitHub 建立公開 Repository，例如 `SafeContract`。
2. 將本資料夾**內部**的 `index.html`、`src/`、`tests/`、`contracts/`、`docs/`、`package.json`、`README.md` 上傳至 Repository 根目錄。
3. 開啟 Repository 的 Settings → Pages → Build and deployment → Deploy from a branch。
4. Branch 選 `main`，Folder 選 `/(root)`，按 Save。
5. 等待部署後開啟 `https://你的帳號.github.io/SafeContract/`。

## 專案架構

- `index.html`：網站介面、教育內容、情境操作、風險檢查、測驗、學習報告。
- `src/engine.mjs`：實際 JavaScript 交易規則引擎。
- `tests/engine.test.mjs`：12 項 Node.js 自動化測試。
- `contracts/SafeEscrow.sol`：獨立 Solidity 教學合約原始碼，**未與網站連接**。
- `docs/TEST_RESULTS.md`：原型測試說明。

## 重要限制

本平台不是真實支付系統，也不是詐騙偵測服務。所有交易金額都是模擬點數，不連接錢包、不收款、不上鏈；風險檢查僅根據使用者勾選的訊號顯示一般性提醒。智慧合約無法自行驗證現實世界的商品交付、身分真偽或仲裁公平性。Solidity 程式碼未經安全審計，不應用於真實資產。

## 青年百億申請書展示建議

建議截圖：(1) 首頁及生活化介紹；(2) 賣方未授權放款被拒；(3) 風險檢查結果；(4) 防詐測驗；(5) `npm test` 的 12/12 測試結果。申請書可描述為「已完成可互動的教育型原型及 JavaScript 規則測試」，不要宣稱已部署鏈上智慧合約或能實際辨識詐騙。
