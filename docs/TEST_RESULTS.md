# SafeContract v1.0 測試紀錄

- 執行環境：Node.js v22.16.0
- 指令：`node --test tests/*.test.mjs`
- 測試結果：**12 passed / 0 failed**
- 測試對象：`src/engine.mjs`（JavaScript 狀態機）
- Solidity 合約：**未編譯、未執行合約測試、未經審計**

| 測試案例 | 預期結果 | 實際結果 |
|---|---|---|
| 正常交易 | 釋放給賣方 | PASS |
| 賣方自行放款 | 拒絕 | PASS |
| 陌生人放款 | 拒絕 | PASS |
| 重複付款 | 拒絕 | PASS |
| 未逾期退款 | 拒絕 | PASS |
| 逾期退款 | 退款給買方 | PASS |
| 仲裁者退款 | 退款給買方 | PASS |
| 賣方自行裁決 | 拒絕 | PASS |
| 結束後再次放款 | 拒絕 | PASS |
| 不合法金額 | 拒絕 | PASS |
| 買賣雙方相同 | 拒絕 | PASS |
| 未知操作 | 拒絕 | PASS |

這些測試只證明目前 JavaScript 模型在列出的案例符合預期，不代表能防止真實世界的詐騙或智慧合約漏洞。
