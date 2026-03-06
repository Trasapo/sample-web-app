/**
 * モックAPI実装
 * ファイルからJSONデータを読み込んで返します
 */
class ApiMock {
  constructor(config) {
    this.config = config;
    this.cache = {}; // データキャッシュ
  }

  /**
   * JSONファイルを読み込む
   */
  async loadJsonFile(fileName) {
    // キャッシュがあればそれを返す
    if (this.cache[fileName]) {
      return this.cache[fileName];
    }

    try {
      // ファイル名からキーへのマッピング (例: 'packages.json' -> 'packages')
      const key = fileName.replace('.json', '');

      // グローバル変数からデータを取得 (JSファイル注入方式)
      if (typeof window.MOCK_DB !== 'undefined' && window.MOCK_DB[key]) {
        const data = window.MOCK_DB[key];
        console.log(`Loaded data from MOCK_DB.${key}:`, data); // DEBUG
        this.cache[fileName] = data;
        return data;
      }

      // フォールバック: fetch を試みる（サーバー環境用）
      console.warn(`Data for ${key} not found in MOCK_DB, trying fetch...`);
      const response = await fetch(`${this.config.MOCK_DATA_PATH}/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${fileName}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Loaded data from ${fileName} via fetch:`, data); // DEBUG
      // キャッシュに保存
      this.cache[fileName] = data;
      return data;
    } catch (error) {
      console.error(`Error loading mock data from ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * 遅延をシミュレート（APIのレスポンス時間を再現）
   */
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 荷物一覧を取得
   */
  async getPackages(date) {
    await this.delay();
    const allPackages = await this.loadJsonFile('packages.json');

    // ディープコピーを作成して返す（元データを保護）
    const packagesCopy = JSON.parse(JSON.stringify(allPackages));

    // 日付指定がない場合は全て返す（または空を返す仕様なら変更）
    if (!date) return packagesCopy;

    // ISO 8601形式 (YYYY-MM-DD) で直接比較
    return packagesCopy.filter(pkg => pkg.deliveryDate === date);
  }

  /**
   * ピッキングリストを取得
   */
  async getPickingList() {
    await this.delay();
    return await this.loadJsonFile('picking-list.json');
  }

  /**
   * 振り分け者一覧を取得
   */
  async getAssigners() {
    await this.delay();
    return await this.loadJsonFile('assigners.json');
  }

  /**
   * ユーザー一覧を取得（権限でフィルタリング）
   */
  async getUsers(authority) {
    await this.delay();
    const allUsers = await this.loadJsonFile('users.json');

    if (authority === undefined || authority === null) return allUsers;

    return allUsers.filter(user => user.authority === Number(authority));
  }

  /**
   * 荷物を保存（モックではローカルストレージに保存）
   */
  async savePackages(data) {
    await this.delay();
    // モックではローカルストレージに保存
    localStorage.setItem('mock_packages', JSON.stringify(data));
    return { success: true, message: '保存しました' };
  }

  /**
   * ピッキングリストを保存
   */
  async savePickingList(data) {
    await this.delay();
    localStorage.setItem('mock_picking_list', JSON.stringify(data));
    return { success: true, message: '保存しました' };
  }

  /**
   * 振り分け者を保存
   */
  async saveAssigners(data) {
    await this.delay();
    localStorage.setItem('mock_assigners', JSON.stringify(data));
    return { success: true, message: '保存しました' };
  }

  /**
   * ログイン
   */
  async login(username, password) {
    await this.delay();
    // モックでは常に成功
    return {
      success: true,
      token: 'mock_token_' + Date.now(),
      user: {
        id: 1,
        username: username || 'TEST USER',
        name: 'TEST USER'
      }
    };
  }

  /**
   * ログアウト
   */
  async logout() {
    await this.delay();
    return { success: true };
  }
}

