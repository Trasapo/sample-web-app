/**
 * 実際のAPI実装
 * 後からAPIサーバーに接続する際に使用します
 */
class ApiReal {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * APIリクエストを送信
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // トークンがある場合は追加
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.API_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * GETリクエスト
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POSTリクエスト
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUTリクエスト
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETEリクエスト
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * 荷物一覧を取得
   */
  async getPackages(date) {
    // クエリパラメータで日付を渡す
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return this.get(`/packages${query}`);
  }

  /**
   * ピッキングリストを取得
   */
  async getPickingList() {
    return this.get('/picking-list');
  }

  /**
   * 振り分け者一覧を取得
   */
  async getAssigners() {
    return this.get('/assigners');
  }

  /**
   * ユーザー一覧を取得
   */
  async getUsers(authority) {
    const query = authority ? `?authority=${authority}` : '';
    return this.get(`/users${query}`);
  }

  /**
   * 荷物を保存
   */
  async savePackages(data) {
    return this.post('/packages', data);
  }

  /**
   * ピッキングリストを保存
   */
  async savePickingList(data) {
    return this.post('/picking-list', data);
  }

  /**
   * 振り分け者を保存
   */
  async saveAssigners(data) {
    return this.post('/assigners', data);
  }

  /**
   * ログイン
   */
  async login(username, password) {
    const response = await this.post('/auth/login', { username, password });
    if (response.success && response.token) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  }

  /**
   * ログアウト
   */
  async logout() {
    const response = await this.post('/auth/logout', {});
    this.token = null;
    localStorage.removeItem('auth_token');
    return response;
  }
}

