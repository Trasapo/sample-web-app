// サイドバーの開閉機能
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function openSidebar() {
  if (sidebar && sidebarOverlay && sidebarToggle) {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
    sidebarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // スクロールを無効化
  }
}

function closeSidebar() {
  if (sidebar && sidebarOverlay && sidebarToggle) {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // スクロールを有効化
  }
}

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// タイトルドロップダウンの開閉機能
const titleDropdownToggle = document.getElementById('title-dropdown-toggle');
const titleDropdown = document.getElementById('title-dropdown');

if (titleDropdownToggle && titleDropdown) {
  titleDropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = titleDropdown.classList.contains('hidden');
    if (isHidden) {
      titleDropdown.classList.remove('hidden');
    } else {
      titleDropdown.classList.add('hidden');
    }
  });

  // ドロップダウン外をクリックしたら閉じる
  document.addEventListener('click', (e) => {
    if (!titleDropdownToggle.contains(e.target) && !titleDropdown.contains(e.target)) {
      titleDropdown.classList.add('hidden');
    }
  });
}

// ログアウト確認ダイアログの機能
const logoutLink = document.getElementById('logout-link');
const logoutDialog = document.getElementById('logout-dialog');
const logoutDialogOverlay = document.getElementById('logout-dialog-overlay');
const logoutCancel = document.getElementById('logout-cancel');
const logoutConfirm = document.getElementById('logout-confirm');

function openLogoutDialog() {
  if (logoutDialog && logoutDialogOverlay) {
    logoutDialog.classList.remove('hidden');
    logoutDialogOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeLogoutDialog() {
  if (logoutDialog && logoutDialogOverlay) {
    logoutDialog.classList.add('hidden');
    logoutDialogOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

if (logoutLink) {
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    openLogoutDialog();
  });
}

if (logoutCancel) {
  logoutCancel.addEventListener('click', closeLogoutDialog);
}

if (logoutDialogOverlay) {
  logoutDialogOverlay.addEventListener('click', closeLogoutDialog);
}

if (logoutConfirm) {
  logoutConfirm.addEventListener('click', () => {
    // ログアウト時に日付設定をクリア
    sessionStorage.removeItem('targetDate');
    window.location.href = 'index.html';
  });
}

// -----------------------------------------------------------------------------
// 日付管理・ダイアログ制御ロジック (SessionStorage版)
// -----------------------------------------------------------------------------

// 今日の日付文字列を取得 (YYYY-MM-DD)
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 読み込んだ荷物データを保持する変数（クライアントサイドフィルタリング用）
let loadedPackages = [];
// 現在選択中の担当者ID
let selectedAssignerId = null;

// Flatpickrのインスタンス（インライン用）
let inlineFp = null;

// 日付管理の初期化
function initDateManagement() {
  // DOM要素の取得
  const targetDateInput = document.getElementById('target-date');
  const dateDialog = document.getElementById('date-dialog');
  const dateDialogOverlay = document.getElementById('date-dialog-overlay');
  const inlineCalendarInput = document.getElementById('inline-calendar');
  const dateConfirmBtn = document.getElementById('date-confirm-btn');
  const prevDayBtn = document.getElementById('prev-day-btn');
  const todayBtn = document.getElementById('today-btn');
  const nextDayBtn = document.getElementById('next-day-btn');

  // ダイアログを表示する関数
  function showDateDialog() {
    if (dateDialog && dateDialogOverlay) {
      dateDialog.classList.remove('hidden');
      dateDialogOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      // ダイアログ表示時にリサイズイベントを発火してFlatpickrを正しく表示させる
      if (inlineFp) {
        // 少し遅延させて再描画（モーダルの表示完了を待つ）
        setTimeout(() => {
          inlineFp.redraw();
        }, 10);
      }
    }
  }

  // ダイアログを閉じる関数
  function closeDateDialog() {
    if (dateDialog && dateDialogOverlay) {
      dateDialog.classList.add('hidden');
      dateDialogOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  // SessionStorageから保存された日付を取得
  const savedDate = sessionStorage.getItem('targetDate');
  const initialDate = savedDate || getTodayString();

  // サイドバーの日付ピッカーを初期化
  if (targetDateInput && typeof flatpickr !== 'undefined') {
    flatpickr(targetDateInput, {
      locale: 'ja',
      dateFormat: 'Y-m-d',
      defaultDate: initialDate,
      mobile: true, // モバイルではネイティブUI
      allowInput: true,
      onChange: function (selectedDates, dateStr) {
        // 日付が変更されたらSessionStorageに保存
        sessionStorage.setItem('targetDate', dateStr);
        // インラインカレンダーとも同期
        if (inlineFp) {
          inlineFp.setDate(dateStr);
        }
        // リストを再描画しない（リロードボタンで明示的に実行）
        // if (typeof filterAndRenderPackages === 'function') {
        //   filterAndRenderPackages();
        // }
        // ヘッダーの日付表示も更新しない（データと日付が不一致になるため）
        // if (typeof updateListHeaderDate === 'function') {
        //     updateListHeaderDate(dateStr);
        // }
      }
    });

    // SessionStorageに値がない場合のみダイアログを表示
    if (!savedDate) {
      showDateDialog();
    }
  } else {
    // Flatpickrが読み込まれていない場合のエラーハンドリング
    if (typeof flatpickr === 'undefined') {
      console.error('Flatpickr library defined unexpectedly.');
    }
  }

  // ダイアログ内のインラインカレンダーを初期化
  if (inlineCalendarInput && typeof flatpickr !== 'undefined') {
    inlineFp = flatpickr(inlineCalendarInput, {
      locale: 'ja',
      dateFormat: 'Y-m-d',
      defaultDate: initialDate,
      inline: true, // 常に表示
      onChange: function (selectedDates, dateStr) {
        // changeイベントでは保存せず、確定ボタン押下時に保存
      }
    });
  }

  // ボタンイベントの設定 (存在確認をしてから追加)
  if (dateConfirmBtn) {
    dateConfirmBtn.addEventListener('click', () => {
      if (inlineFp && targetDateInput) {
        // 選択された日付を取得
        const selectedDate = inlineFp.input.value;

        // サイドバーに反映（インスタンス経由）
        const sidebarFp = targetDateInput._flatpickr;
        if (sidebarFp) {
          sidebarFp.setDate(selectedDate);
        } else {
          // フォールバック: 直接値をセット
          targetDateInput.value = selectedDate;
        }

        // SessionStorageに保存
        sessionStorage.setItem('targetDate', selectedDate);

        // リストを再描画
        if (typeof fetchAndRenderPackages === 'function') {
          fetchAndRenderPackages();
        }

        // ダイアログを閉じる
        closeDateDialog();
      } else {
        closeDateDialog(); // 最低限閉じる
      }
    });
  }

  if (prevDayBtn) {
    prevDayBtn.addEventListener('click', () => {
      if (inlineFp) {
        const currentDate = inlineFp.selectedDates[0] || new Date();
        // 日付操作を安全に行う
        const newDate = new Date(currentDate.getTime());
        newDate.setDate(newDate.getDate() - 1);
        inlineFp.setDate(newDate);
      }
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      if (inlineFp) {
        inlineFp.setDate(new Date());
      }
    });
  }

  if (nextDayBtn) {
    nextDayBtn.addEventListener('click', () => {
      if (inlineFp) {
        const currentDate = inlineFp.selectedDates[0] || new Date();
        const newDate = new Date(currentDate.getTime());
        newDate.setDate(newDate.getDate() + 1);
        inlineFp.setDate(newDate);
      }
    });
  }
}

// 初期化実行（DOMContentLoadedで確実に実行）
document.addEventListener('DOMContentLoaded', () => {
  initDateManagement();

  // セッションストレージに日付が保存されている場合のみ、初期ロードを行う
  // 保存されていない場合はダイアログが表示されているはずなので、ユーザーの決定を待つ
  if (sessionStorage.getItem('targetDate') && typeof fetchAndRenderPackages === 'function') {
    fetchAndRenderPackages();
  }

  // アコーディオンの初期化
  initAccordion();

  // 担当者リストの読み込み
  fetchAndRenderAssigners();

  // 担当者荷物リストの初期表示（未選択状態）
  renderAssignerPackages(null, null);



  // リロードボタンのイベントリスナー
  const reloadBtn = document.getElementById('reload-button');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      // データを再取得して表示
      if (typeof fetchAndRenderPackages === 'function') {
        fetchAndRenderPackages();
      }
      // 担当者リストも再読み込み
      if (typeof fetchAndRenderAssigners === 'function') {
        fetchAndRenderAssigners();
      }
      // 担当者別リストもリセット
      if (typeof renderAssignerPackages === 'function') {
        renderAssignerPackages(null, null);
      }
      // 選択状態変数をリセット
      selectedAssignerId = null;
    });
  }

  // ---------------------------------------------------------------------------
  // クリックイベントの委譲（荷物割り当て/解除）
  // ---------------------------------------------------------------------------

  // 1. 未割り当てリストのクリック（割り当て）
  const unassignedListBody = document.getElementById('packages-list');
  if (unassignedListBody) {
    unassignedListBody.addEventListener('click', (event) => {
      // 担当者が選択されていない場合は何もしない
      if (!selectedAssignerId) return;

      const tr = event.target.closest('tr');
      if (!tr || !tr.dataset.packageId) return;

      const packageId = tr.dataset.packageId;
      // 選択中の担当者に割り当て
      updatePackageAssignment(packageId, selectedAssignerId);
    });
  }

  // 2. 担当者荷物リストのクリック（解除）
  const assignerListBody = document.getElementById('assigner-packages-list');
  if (assignerListBody) {
    assignerListBody.addEventListener('click', (event) => {
      const tr = event.target.closest('tr');
      if (!tr || !tr.dataset.packageId) return;

      const packageId = tr.dataset.packageId;
      // 割り当て解除（空文字）
      updatePackageAssignment(packageId, "");
    });
  }
});

// アコーディオン開閉ロジック
function initAccordion() {
  const toggleBtn = document.getElementById('package-list-toggle');
  const container = document.getElementById('package-list-container');
  const icon = document.getElementById('package-list-icon');

  if (toggleBtn && container && icon) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        // 閉じる
        toggleBtn.setAttribute('aria-expanded', 'false');
        container.style.maxHeight = '0px';
        container.classList.add('opacity-0');
        container.classList.add('overflow-hidden'); // 完全に隠すために追加
        icon.classList.remove('rotate-180');
      } else {
        // 開く
        toggleBtn.setAttribute('aria-expanded', 'true');
        container.classList.remove('opacity-0');
        container.classList.remove('overflow-hidden');
        // scrollHeightを使って滑らかに開く
        container.style.maxHeight = container.scrollHeight + 'px';
        icon.classList.add('rotate-180');

        // トランジション終了後にmax-heightを解除（中身が増減しても良いように）
        // ただし、単純な max-height: none だと閉じるときのアニメーションが効かなくなるため、
        // 今回はシンプルに大きな値を設定するか、あるいは固定にする。
        // ここでは再度閉じる可能性を考慮し、scrollHeightの再計算が必要なケースは稀として一旦そのまま。
        // もしデータ読み込みで高さが変わる場合は、renderPackages内で高さを再設定する必要がある。
      }
    });

    // 初期状態の設定（開いた状態）
    container.style.maxHeight = container.scrollHeight + 'px';
  }
}

// -----------------------------------------------------------------------------
// 担当者リスト機能
// -----------------------------------------------------------------------------

async function fetchAndRenderAssigners() {
  const container = document.getElementById('assigner-list');
  if (!container) return;

  try {
    // 権限3（担当者）のユーザーを取得
    const assigners = await api.getUsers(3);

    container.innerHTML = '';

    if (!assigners || assigners.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-sm">担当者が見つかりません</div>';
      return;
    }

    const fragment = document.createDocumentFragment();

    // 選択状態管理のための変数
    let selectedButton = null;

    assigners.forEach(user => {
      const button = document.createElement('button');
      // 基本スタイル（未選択）
      const baseClass = 'px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors';
      // 選択済みスタイル（iOS Blue風: bg-blue-500 text-white）
      const selectedClass = 'px-4 py-2 bg-blue-500 border border-blue-500 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none transition-colors';

      button.className = baseClass;
      button.textContent = user.name; // ニックネーム
      button.dataset.userId = user.id;

      // クリックイベント
      button.addEventListener('click', () => {
        // すでに選択されているボタンがあれば未選択状態に戻す
        if (selectedButton) {
          selectedButton.className = baseClass;
        }

        // クリックされたボタンを選択状態にする
        // （「選択は解除されない」＝同じボタンを押しても非選択にはならない）
        button.className = selectedClass;
        selectedButton = button;
        selectedAssignerId = user.id; // グローバル変数を更新

        console.log('Selected assigner:', user.name);

        // 担当者別荷物リストを表示
        renderAssignerPackages(user.id, user.name);
      });

      fragment.appendChild(button);
    });

    container.appendChild(fragment);

  } catch (error) {
    console.error('Error fetching assigners:', error);
    container.innerHTML = `<div class="text-red-500 text-sm">読み込み失敗: ${error.message}</div>`;
  }
}

// -----------------------------------------------------------------------------
// 担当者別荷物リスト機能（新規）
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// 担当者別荷物リスト機能（新規）
// -----------------------------------------------------------------------------
function renderAssignerPackages(assignerId, assignerName, scrollToBottom = false) {
  const container = document.getElementById('assigner-package-list-wrapper');
  const scrollContainer = document.getElementById('assigner-packages-scroll-container');
  const listBody = document.getElementById('assigner-packages-list');
  const nameDisplay = document.getElementById('assigner-name-display');

  if (!container || !listBody) return;

  // 選択解除（null）された場合の表示
  if (!assignerId) {
    container.classList.remove('hidden'); // 常に表示
    if (nameDisplay) {
      nameDisplay.textContent = '未選択';
    }
    listBody.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">担当者を選択してください</td></tr>';
    return;
  }

  // 表示処理
  container.classList.remove('hidden');
  if (nameDisplay) {
    nameDisplay.textContent = assignerName ? `${assignerName} さんの担当分` : '';
  }

  // listBody.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">読み込み中...</td></tr>';

  try {
    // 保持しているデータからフィルタリング
    // API呼び出しは行わず、fetchAndRenderPackagesで取得済みのloadedPackagesを使用する
    const allPackages = loadedPackages || [];

    // フィルタリング: assignerId が一致するもの
    const filtered = allPackages.filter(pkg => String(pkg.assignerId) === String(assignerId));

    listBody.innerHTML = '';

    if (filtered.length === 0) {
      listBody.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">担当する荷物はありません</td></tr>';
      return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach(pkg => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-gray-50 transition-colors cursor-pointer'; // クリック可能
      tr.dataset.packageId = pkg.id; // ID埋め込み
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${pkg.trackingNumber}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.productName}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${pkg.quantity}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.recipient}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title="${pkg.address}">${pkg.address}</td>
      `;
      fragment.appendChild(tr);
    });

    listBody.appendChild(fragment);

    // スクロール最下部へ移動（追加時など）
    if (scrollToBottom && scrollContainer) {
      // 描画完了を少し待つ（DOM反映とスタイル計算のため少し長めに）
      setTimeout(() => {
        console.log('Scrolling to bottom:', scrollContainer.scrollHeight);
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100);
    }

  } catch (error) {
    console.error('Error rendering assigner packages:', error);
    listBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-red-500">読み込み失敗: ${error.message}</td></tr>`;
  }
}

// -----------------------------------------------------------------------------
// 荷物リスト機能
// -----------------------------------------------------------------------------

async function fetchAndRenderPackages() {
  const tableBody = document.getElementById('packages-list');
  if (!tableBody) return; // assign.htmlでない場合は終了

  // ローディング表示（一瞬で終わるが一応）
  // tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">読み込み中...</td></tr>';

  try {
    // API経由の取得（Mock/Real共通インターフェース）
    const targetDate = getTargetDate();
    updateListHeaderDate(targetDate);

    const filteredPackages = await api.getPackages(targetDate);

    // データを変数に保存（担当者ボタンクリック時の高速フィルタリング用）
    loadedPackages = filteredPackages;

    // ユーザーリストの取得テスト（一旦コメントアウト）
    /*
    try {
      const users = await api.getUsers(3);
      console.log('Fetched users with authority 3:', users);
    } catch (e) {
      console.error('Failed to fetch users:', e);
    }
    */

    renderUnassignedPackages();
  } catch (error) {
    console.error('Error fetching packages:', error);
    // 詳細なエラーメッセージを表示
    tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-red-500">
      データの読み込みに失敗しました。<br>
      ${error.message}
    </td></tr>`;

    // エラー表示時もアコーディオンの高さを更新
    const container = document.getElementById('package-list-container');
    const toggleBtn = document.getElementById('package-list-toggle');
    if (container && toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'true') {
      setTimeout(() => {
        container.style.maxHeight = container.scrollHeight + 'px';
      }, 0);
    }
  }
}

// 現在選択されている日付を取得するヘルパー関数
function getTargetDate() {
  const targetDateInput = document.getElementById('target-date');
  return targetDateInput ? targetDateInput.value : getTodayString();
}

// リストヘッダーの日付を更新
function updateListHeaderDate(dateStr) {
  const headerDateEl = document.getElementById('list-header-date');
  if (headerDateEl && dateStr) {
    // YYYY-MM-DD -> YYYY/MM/DD 表記に変換して表示
    headerDateEl.textContent = dateStr.replace(/-/g, '/');
  }
}

// 未割り当て荷物リストの描画（メモリ内のデータを使用）
function renderUnassignedPackages() {
  const listBody = document.getElementById('packages-list');
  if (!listBody) return;

  const UNASSIGNED_ID = ""; // 未割り当てを表すID

  // フィルタリング: assignerId が空のもの
  // または assignerId プロパティが無いもの
  const unassignedPackages = loadedPackages.filter(pkg => !pkg.assignerId || String(pkg.assignerId) === String(UNASSIGNED_ID));

  listBody.innerHTML = '';

  if (unassignedPackages.length === 0) {
    listBody.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">未割り当ての荷物はありません</td></tr>';
    return;
  }

  const fragment = document.createDocumentFragment();
  unassignedPackages.forEach(pkg => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50 transition-colors cursor-pointer'; // クリック可能であることを示す
    tr.dataset.packageId = pkg.id; // IDを埋め込む

    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${pkg.trackingNumber}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.productName}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${pkg.quantity}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.recipient}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title="${pkg.address}">${pkg.address}</td>
    `;
    fragment.appendChild(tr);
  });

  listBody.appendChild(fragment);

  // コンテンツ更新後にアコーディオンの高さを再計算（開いている場合のみ）
  const container = document.getElementById('package-list-container');
  const toggleBtn = document.getElementById('package-list-toggle');
  if (container && toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'true') {
    setTimeout(() => {
      container.style.maxHeight = container.scrollHeight + 'px';
    }, 0);
  }
}

// -----------------------------------------------------------------------------
// 荷物割り当て更新ロジック
// -----------------------------------------------------------------------------
function updatePackageAssignment(packageId, newAssignerId) {
  // メモリ内のデータを検索して更新
  const pkgIndex = loadedPackages.findIndex(p => String(p.id) === String(packageId));

  if (pkgIndex === -1) return;

  // データの更新
  loadedPackages[pkgIndex].assignerId = newAssignerId;

  // 配列の末尾に移動（追加したアイテムが常にリストの最後に表示されるようにする）
  // 未割り当てに戻す場合（newAssignerId=""）は順序変更しない、等の制御も可能だが
  // 「追加された荷物が見えるように」という要望なので、割り当て時は末尾移動が必須。
  // 解除時は未割り当てリストのどこに戻るか？ 現状は末尾になる。それで問題ないはず。
  if (newAssignerId) {
    const [movedPkg] = loadedPackages.splice(pkgIndex, 1);
    loadedPackages.push(movedPkg);
  }

  // UIの再描画
  renderUnassignedPackages(); // 未割り当てリスト更新

  // 常に現在選択されている担当者のリストを更新すればよい
  const currentNameElement = document.getElementById('assigner-name-display');
  let currentName = "";
  if (currentNameElement && currentNameElement.textContent) {
    currentName = currentNameElement.textContent.replace(' さんの担当分', '').replace('未選択', '');
  }

  // 割り当て時（newAssignerIdがある場合）はスクロール最下部へ
  const shouldScroll = !!newAssignerId;
  const scrollContainer = document.getElementById('assigner-packages-scroll-container');

  // アコーディオンが開いている（h-autoに近い）場合はスクロール不要かもしれないが
  // 基本的には「追加されたものが見える」ようにするのは親切。
  renderAssignerPackages(selectedAssignerId, currentName, shouldScroll);
}

// -----------------------------------------------------------------------------
// 担当者荷物リスト アコーディオン制御機能
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-assigner-list-btn');
  const scrollContainer = document.getElementById('assigner-packages-scroll-container');
  let isExpanded = false;

  if (toggleBtn && scrollContainer) {
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;

      if (isExpanded) {
        // 展開: 高さ制限を解除 (h-auto相当)
        // h-[12.5rem] クラスを削除して、styleでheight: auto または max-height: none を適用
        scrollContainer.classList.remove('h-[12.5rem]');
        scrollContainer.style.height = 'auto'; // 全体表示
        scrollContainer.style.maxHeight = 'none'; // max-heightがあれば解除

        // アイコンを180度回転
        toggleBtn.classList.add('rotate-180');
      } else {
        // 折りたたみ: 3行固定 (h-[12.5rem]) に戻す
        scrollContainer.style.height = '';
        scrollContainer.style.maxHeight = '';
        scrollContainer.classList.add('h-[12.5rem]');

        // アイコンの回転を戻す
        toggleBtn.classList.remove('rotate-180');
      }
    });
  }
});

// -----------------------------------------------------------------------------
// ピッキング画面 ロジック
// -----------------------------------------------------------------------------
function initPickingPage() {
  // 1. ログインチェック (アクセストークン確認)
  const accessToken = sessionStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('Invalid Access Token');
    window.location.href = 'index.html';
    return;
  }

  // ユーザー情報の解決（トークン = ID からユーザーを特定）
  // ※ 本来は /me エンドポイントなどを叩くが、ここでは全ユーザーから検索
  let currentUser = null;
  // ユーザーデータがロードされている保証がないので、ここでロード
  // api.js に getUsers がある前提
  api.getUsers().then(users => {
    currentUser = users.find(u => String(u.id) === String(accessToken));
    if (!currentUser) {
      console.error('Invalid Access Token');
      window.location.href = 'index.html';
      return;
    }

    // 3. データ取得と描画へ進む
    loadPickingData(currentUser);

  }).catch(err => {
    console.error('Failed to load users:', err);
  });
}

function loadPickingData(currentUser) {

  // 3. データ取得と描画
  const storedDate = sessionStorage.getItem('targetDate');
  const targetDate = storedDate || new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '-');

  fetchAndRenderPickingPackages(currentUser, targetDate);

  // リロードボタンの設定
  setupReloadButton(currentUser, targetDate);
}

function fetchAndRenderPickingPackages(currentUser, targetDate) {
  // パッケージ取得（API経由）
  api.getPackages(targetDate).then(packages => {
    // グローバル変数にセット
    loadedPackages = packages;

    // 担当割り当て済み かつ 自分のID のものをフィルタリング
    const myPackages = packages.filter(p => String(p.assignedTo) === String(currentUser.id));

    renderPickingList(myPackages);
  }).catch(err => {
    console.error('Failed to load packages:', err);
    const tbody = document.getElementById('picking-list');
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">読み込みに失敗しました</td></tr>`;
  });
}

function renderPickingList(packages) {
  const tbody = document.getElementById('picking-list');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (packages.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">担当する荷物はありません</td></tr>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  packages.forEach(pkg => {
    const tr = document.createElement('tr');
    tr.className = 'cursor-pointer hover:bg-gray-50 transition-colors';
    tr.dataset.packageId = pkg.id;

    const isPicked = pkg.picked === true;
    if (isPicked) {
      tr.classList.add('bg-gray-100', 'text-gray-500');
    }

    tr.innerHTML = `
      <td class="px-2 py-3 text-sm text-gray-900 align-top break-all max-w-[80px]">${pkg.trackingNumber}</td>
      <td class="px-2 py-3 text-sm text-gray-900 align-top">${pkg.productName}</td>
      <td class="px-2 py-3 text-sm text-gray-900 align-top text-center">${pkg.quantity}</td>
      <td class="px-2 py-3 text-sm text-gray-900 align-top text-xs">
        <div class="line-clamp-2" title="${pkg.address}">
          ${pkg.address}
        </div>
        <div class="text-gray-500 mt-1 text-[10px]">${pkg.recipient}</div>
      </td>
      <td class="px-2 py-3 align-top text-center">
        <label class="inline-flex items-center cursor-pointer group">
          <input type="checkbox"
                 class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out cursor-pointer"
                 ${isPicked ? 'checked' : ''}
                 data-package-id="${pkg.id}"
                 onchange="togglePackageStatus(this)">
        </label>
      </td>
    `;

    // 行クリックでチェックボックスをトグル（スクロール時は無効）
    let touchStartY = 0;
    let touchEndY = 0;

    tr.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    tr.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].clientY;
      const scrollDistance = Math.abs(touchEndY - touchStartY);

      // スクロール距離が10px以下ならタップと判定
      if (scrollDistance < 10 && e.target.type !== 'checkbox') {
        e.preventDefault();
        const checkbox = tr.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;

        // チェックボックスの状態を直接更新
        const packageId = checkbox.dataset.packageId;
        const pkg = loadedPackages.find(p => String(p.id) === String(packageId));
        if (pkg) {
          pkg.picked = checkbox.checked;
          if (checkbox.checked) {
            tr.classList.add('bg-gray-100', 'text-gray-500');
          } else {
            tr.classList.remove('bg-gray-100', 'text-gray-500');
          }
        }
      }
    });

    // デスクトップ用のクリックイベント
    tr.addEventListener('click', (e) => {
      // チェックボックス自体のクリックは除外（二重トグルを防ぐ）
      if (e.target.type !== 'checkbox') {
        e.preventDefault();
        const checkbox = tr.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;

        // チェックボックスの状態を直接更新
        const packageId = checkbox.dataset.packageId;
        const pkg = loadedPackages.find(p => String(p.id) === String(packageId));
        if (pkg) {
          pkg.picked = checkbox.checked;
          if (checkbox.checked) {
            tr.classList.add('bg-gray-100', 'text-gray-500');
          } else {
            tr.classList.remove('bg-gray-100', 'text-gray-500');
          }
        }
      }
    });

    fragment.appendChild(tr);
  });
  tbody.appendChild(fragment);
}

// チェックボックス操作
window.togglePackageStatus = function (checkbox) {
  const packageId = checkbox.dataset.packageId;
  const isChecked = checkbox.checked;

  const pkg = loadedPackages.find(p => String(p.id) === String(packageId));
  if (pkg) {
    pkg.picked = isChecked;

    const tr = checkbox.closest('tr');
    if (isChecked) {
      tr.classList.add('bg-gray-100', 'text-gray-500');
    } else {
      tr.classList.remove('bg-gray-100', 'text-gray-500');
    }
  }
};

// リロードボタンの処理
function setupReloadButton(currentUser, targetDate) {
  const reloadButton = document.getElementById('reload-button');
  const reloadDialog = document.getElementById('reload-dialog');
  const reloadDialogOverlay = document.getElementById('reload-dialog-overlay');
  const reloadCancel = document.getElementById('reload-cancel');
  const reloadConfirm = document.getElementById('reload-confirm');

  if (!reloadButton || !reloadDialog) return;

  // リロードダイアログを開く
  const openReloadDialog = () => {
    reloadDialog.classList.remove('hidden');
    reloadDialogOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  // リロードダイアログを閉じる
  const closeReloadDialog = () => {
    reloadDialog.classList.add('hidden');
    reloadDialogOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // リロードボタンクリック
  reloadButton.addEventListener('click', openReloadDialog);

  // キャンセルボタン
  if (reloadCancel) {
    reloadCancel.addEventListener('click', closeReloadDialog);
  }

  // オーバーレイクリック
  if (reloadDialogOverlay) {
    reloadDialogOverlay.addEventListener('click', closeReloadDialog);
  }

  // リロード実行
  if (reloadConfirm) {
    reloadConfirm.addEventListener('click', () => {
      closeReloadDialog();

      // ローディング表示
      const tbody = document.getElementById('picking-list');
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">読み込み中...</td></tr>`;
      }

      // データベースから最新データを再取得
      fetchAndRenderPickingPackages(currentUser, targetDate);
    });
  }
}

// ページ読み込み時の分岐
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('picking.html')) {
    initPickingPage();
  }
});
