/**
 * APIサービス層
 * モックとAPI実装を統一インターフェースで提供します
 * 
 * 使用方法:
 *   const api = new ApiService();
 *   const packages = await api.getPackages();
 *   await api.savePackages(data);
 */
class ApiService {
  constructor() {
    // 設定に基づいてモックまたはAPI実装を選択
    if (CONFIG.USE_MOCK) {
      this.impl = new ApiMock(CONFIG);
      console.log('🔧 モックモードで動作しています');
    } else {
      this.impl = new ApiReal(CONFIG);
      console.log('🌐 APIモードで動作しています');
    }
  }

  // 荷物関連
  async getPackages(date) {
    return this.impl.getPackages(date);
  }

  async savePackages(data) {
    return this.impl.savePackages(data);
  }

  // ピッキングリスト関連
  async getPickingList() {
    return this.impl.getPickingList();
  }

  async savePickingList(data) {
    return this.impl.savePickingList(data);
  }

  // 振り分け者関連
  async getAssigners() {
    return this.impl.getAssigners();
  }

  // ユーザー関連
  async getUsers(authority) {
    return this.impl.getUsers(authority);
  }

  async saveAssigners(data) {
    return this.impl.saveAssigners(data);
  }

  // 認証関連
  async login(username, password) {
    return this.impl.login(username, password);
  }

  async logout() {
    return this.impl.logout();
  }
}

// グローバルにAPIサービスインスタンスを作成
const api = new ApiService();

