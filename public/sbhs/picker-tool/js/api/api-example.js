/**
 * API使用例
 * このファイルは参考用です。実際のページで使用する際は、このコードを参考にしてください。
 */

// ============================================
// 基本的な使用方法
// ============================================

// 1. APIサービスは自動的に初期化されています（api.jsでグローバル変数として定義）
// 2. 各ページのHTMLで以下の順序でスクリプトを読み込んでください：
//    <script src="js/api/config.js"></script>
//    <script src="js/api/apiMock.js"></script>
//    <script src="js/api/apiReal.js"></script>
//    <script src="js/api/api.js"></script>
//    <script src="js/your-page-script.js"></script>

// ============================================
// データ取得の例
// ============================================

async function loadPackages() {
  try {
    const packages = await api.getPackages();
    console.log('荷物一覧:', packages);
    // ここでUIに表示する処理を書く
  } catch (error) {
    console.error('荷物の取得に失敗しました:', error);
    // エラー処理
  }
}

async function loadPickingList() {
  try {
    const pickingList = await api.getPickingList();
    console.log('ピッキングリスト:', pickingList);
  } catch (error) {
    console.error('ピッキングリストの取得に失敗しました:', error);
  }
}

async function loadAssigners() {
  try {
    const assigners = await api.getAssigners();
    console.log('振り分け者一覧:', assigners);
  } catch (error) {
    console.error('振り分け者の取得に失敗しました:', error);
  }
}

// ============================================
// データ保存の例
// ============================================

async function savePackages() {
  const packagesData = [
    { id: 1, trackingNumber: "TRK001", status: "assigned" },
    { id: 2, trackingNumber: "TRK002", status: "pending" }
  ];

  try {
    const result = await api.savePackages(packagesData);
    console.log('保存結果:', result);
    alert(result.message || '保存しました');
  } catch (error) {
    console.error('保存に失敗しました:', error);
    alert('保存に失敗しました');
  }
}

// ============================================
// ログインの例
// ============================================

async function handleLogin(username, password) {
  try {
    const result = await api.login(username, password);
    if (result.success) {
      console.log('ログイン成功:', result.user);
      // ログイン後の処理（ページ遷移など）
      window.location.href = 'assign.html';
    } else {
      console.error('ログイン失敗:', result.message);
      alert('ログインに失敗しました');
    }
  } catch (error) {
    console.error('ログインエラー:', error);
    alert('ログインに失敗しました');
  }
}

// ============================================
// ページ読み込み時のデータ取得例
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // ページ読み込み時にデータを取得
  await loadPackages();
  await loadAssigners();
});

// ============================================
// ボタンクリック時の保存例
// ============================================

document.getElementById('save-button')?.addEventListener('click', async () => {
  // フォームからデータを取得
  const formData = {
    // フォームのデータを取得
  };
  
  try {
    await api.savePackages(formData);
    alert('保存しました');
  } catch (error) {
    alert('保存に失敗しました');
  }
});

