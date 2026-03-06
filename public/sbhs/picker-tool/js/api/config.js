/**
 * アプリケーション設定
 * モックモードとAPIモードを切り替えることができます
 */
const CONFIG = {
  // true: モックモード（ファイルから読み込み）
  // false: APIモード（実際のAPIサーバーに接続）
  USE_MOCK: true,
  
  // APIサーバーのベースURL（APIモード時）
  API_BASE_URL: 'http://localhost:3000/api',
  
  // モックデータのパス（モックモード時）
  MOCK_DATA_PATH: 'data',
  
  // APIタイムアウト（ミリ秒）
  API_TIMEOUT: 10000,
};



