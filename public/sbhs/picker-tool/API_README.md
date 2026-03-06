# APIモックシステム

このプロジェクトでは、APIサーバーがない場合でも開発を進められるように、ファイルベースのモックシステムを実装しています。

## 📁 ファイル構成

```
js/
├── api/              # API関連ファイル
│   ├── config.js      # 設定ファイル（モック/APIモードの切り替え）
│   ├── api.js         # APIサービス層（統一インターフェース）
│   ├── apiMock.js     # モック実装（ファイルから読み込み）
│   ├── apiReal.js     # 実際のAPI実装（後で使用）
│   └── api-example.js # 使用例
└── main.js           # メインスクリプト

data/
├── packages.json      # 荷物データのモック
├── picking-list.json  # ピッキングリストのモック
└── assigners.json     # 振り分け者データのモック
```

## 🚀 使用方法

### 1. HTMLでの読み込み順序

各ページのHTMLで、以下の順序でスクリプトを読み込んでください：

```html
<script src="js/api/config.js"></script>
<script src="js/api/apiMock.js"></script>
<script src="js/api/apiReal.js"></script>
<script src="js/api/api.js"></script>
<script src="js/main.js"></script>
```

### 2. APIの呼び出し

グローバル変数 `api` を使用してAPIを呼び出します：

```javascript
// データ取得
const packages = await api.getPackages();
const pickingList = await api.getPickingList();
const assigners = await api.getAssigners();

// データ保存
await api.savePackages(data);
await api.savePickingList(data);
await api.saveAssigners(data);

// 認証
await api.login(username, password);
await api.logout();
```

## 🔄 モックモードとAPIモードの切り替え

### モックモード（現在）

`js/api/config.js` で `USE_MOCK: true` に設定されています。

```javascript
const CONFIG = {
  USE_MOCK: true,  // モックモード
  // ...
};
```

このモードでは、`data/` ディレクトリ内のJSONファイルからデータを読み込みます。

### APIモードへの切り替え

1. `js/api/config.js` を開く
2. `USE_MOCK: false` に変更
3. `API_BASE_URL` を実際のAPIサーバーのURLに設定

```javascript
const CONFIG = {
  USE_MOCK: false,  // APIモードに切り替え
  API_BASE_URL: 'https://your-api-server.com/api',
  // ...
};
```

これだけで、コードを変更することなく実際のAPIサーバーに接続できます。

## 📝 モックデータの編集

モックデータは `data/` ディレクトリ内のJSONファイルを編集することで変更できます。

- `packages.json` - 荷物データ
- `picking-list.json` - ピッキングリストデータ
- `assigners.json` - 振り分け者データ

## 🔧 カスタマイズ

### 新しいAPIエンドポイントを追加する場合

1. `js/api/apiMock.js` にモック実装を追加
2. `js/api/apiReal.js` に実際のAPI実装を追加
3. `js/api/api.js` に統一インターフェースを追加

例：

```javascript
// js/api/apiMock.js
async getNewData() {
  await this.delay();
  return await this.loadJsonFile('new-data.json');
}

// js/api/apiReal.js
async getNewData() {
  return this.get('/new-data');
}

// js/api/api.js
async getNewData() {
  return this.impl.getNewData();
}
```

## 📚 使用例

詳細な使用例は `js/api/api-example.js` を参照してください。

## ⚠️ 注意事項

- モックモードでは、保存処理はローカルストレージに保存されます
- 実際のAPIサーバーに接続する際は、CORS設定が必要な場合があります
- APIエンドポイントのパスは、実際のAPIサーバーの仕様に合わせて調整してください

