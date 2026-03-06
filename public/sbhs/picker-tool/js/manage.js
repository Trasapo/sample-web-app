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
    document.body.style.overflow = 'hidden';
  }
}

function closeSidebar() {
  if (sidebar && sidebarOverlay && sidebarToggle) {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
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
    sessionStorage.removeItem('targetDate');
    window.location.href = 'index.html';
  });
}

// 今日の日付文字列を取得 (YYYY-MM-DD)
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 読み込んだ荷物データとピッカーデータを保持
let loadedPackages = [];
let loadedPickers = [];
let currentFilter = 'incomplete'; // すべて, completed, incomplete
let accordionStates = {}; // アコーディオンの開閉状態を保持

// Flatpickrのインスタンス
let inlineFp = null;

// 日付管理の初期化
function initDateManagement() {
  const targetDateInput = document.getElementById('target-date');
  const dateDialog = document.getElementById('date-dialog');
  const dateDialogOverlay = document.getElementById('date-dialog-overlay');
  const inlineCalendarInput = document.getElementById('inline-calendar');
  const dateConfirmBtn = document.getElementById('date-confirm-btn');
  const prevDayBtn = document.getElementById('prev-day-btn');
  const todayBtn = document.getElementById('today-btn');
  const nextDayBtn = document.getElementById('next-day-btn');

  function showDateDialog() {
    if (dateDialog && dateDialogOverlay) {
      dateDialog.classList.remove('hidden');
      dateDialogOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      if (inlineFp) {
        setTimeout(() => {
          inlineFp.redraw();
        }, 10);
      }
    }
  }

  function closeDateDialog() {
    if (dateDialog && dateDialogOverlay) {
      dateDialog.classList.add('hidden');
      dateDialogOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  const savedDate = sessionStorage.getItem('targetDate');
  const initialDate = savedDate || getTodayString();

  if (targetDateInput && typeof flatpickr !== 'undefined') {
    flatpickr(targetDateInput, {
      locale: 'ja',
      dateFormat: 'Y-m-d',
      defaultDate: initialDate,
      mobile: true,
      allowInput: true,
      onChange: function (selectedDates, dateStr) {
        sessionStorage.setItem('targetDate', dateStr);
        if (inlineFp) {
          inlineFp.setDate(dateStr);
        }
      }
    });

    if (!savedDate) {
      showDateDialog();
    }
  }

  if (inlineCalendarInput && typeof flatpickr !== 'undefined') {
    inlineFp = flatpickr(inlineCalendarInput, {
      locale: 'ja',
      inline: true,
      defaultDate: initialDate,
      onChange: function (selectedDates, dateStr) {
        sessionStorage.setItem('targetDate', dateStr);
        if (targetDateInput._flatpickr) {
          targetDateInput._flatpickr.setDate(dateStr, false);
        }
      }
    });
  }

  if (dateConfirmBtn) {
    dateConfirmBtn.addEventListener('click', closeDateDialog);
  }

  if (dateDialogOverlay) {
    dateDialogOverlay.addEventListener('click', closeDateDialog);
  }

  if (prevDayBtn && inlineFp) {
    prevDayBtn.addEventListener('click', () => {
      const currentDate = inlineFp.selectedDates[0] || new Date();
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      inlineFp.setDate(prevDate);
    });
  }

  if (todayBtn && inlineFp) {
    todayBtn.addEventListener('click', () => {
      inlineFp.setDate(new Date());
    });
  }

  if (nextDayBtn && inlineFp) {
    nextDayBtn.addEventListener('click', () => {
      const currentDate = inlineFp.selectedDates[0] || new Date();
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      inlineFp.setDate(nextDate);
    });
  }
}

// フィルター機能
function setupFilter() {
  const filterSelect = document.getElementById('status-filter');
  if (filterSelect) {
    // 初期値を設定
    filterSelect.value = currentFilter;

    filterSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      renderPickerAccordions();
    });
  }
}

// ピッキング者ごとの荷物をフィルタリング
function filterPackagesByStatus(packages) {
  if (currentFilter === 'all') {
    return packages;
  } else if (currentFilter === 'completed') {
    return packages.filter(pkg => pkg.picked === true);
  } else if (currentFilter === 'incomplete') {
    return packages.filter(pkg => pkg.picked !== true);
  }
  return packages;
}

// アコーディオンの開閉状態を管理
window.toggleAccordion = function(accordionId) {
  const content = document.getElementById(`accordion-content-${accordionId}`);
  const icon = document.getElementById(`accordion-icon-${accordionId}`);

  if (content && icon) {
    const isHidden = content.classList.contains('hidden');
    if (isHidden) {
      content.classList.remove('hidden');
      icon.classList.add('rotate-180');
      accordionStates[accordionId] = true; // 開いた状態を記録
    } else {
      content.classList.add('hidden');
      icon.classList.remove('rotate-180');
      accordionStates[accordionId] = false; // 閉じた状態を記録
    }
  }
}

// ピッキング者リストのアコーディオンをレンダリング
function renderPickerAccordions() {
  const container = document.getElementById('picker-accordions-container');
  if (!container) return;

  // ピッカーごとに荷物をグループ化
  const pickerPackagesMap = {};

  // 各荷物をピッカーに割り当て（荷物があるピッカーのみマップに追加）
  loadedPackages.forEach(pkg => {
    if (pkg.assignedTo) {
      if (!pickerPackagesMap[pkg.assignedTo]) {
        // ピッカー情報を探す
        const picker = loadedPickers.find(p => p.id === pkg.assignedTo);
        if (picker) {
          pickerPackagesMap[pkg.assignedTo] = {
            picker: picker,
            packages: []
          };
        }
      }
      if (pickerPackagesMap[pkg.assignedTo]) {
        pickerPackagesMap[pkg.assignedTo].packages.push(pkg);
      }
    }
  });

  // アコーディオンHTMLを生成
  let html = '';

  Object.values(pickerPackagesMap).forEach(item => {
    const { picker, packages } = item;
    const filteredPackages = filterPackagesByStatus(packages);

    // フィルター適用後に荷物がない場合はスキップ（「すべて」の場合は荷物があれば常に表示）
    if (currentFilter !== 'all' && filteredPackages.length === 0) {
      return;
    }

    const totalCount = packages.length;
    const completedCount = packages.filter(p => p.picked === true).length;
    const incompleteCount = totalCount - completedCount;

    // フィルターに応じて表示文言を変更
    let statusText = '';
    if (currentFilter === 'all') {
      statusText = `すべて：${totalCount}件`;
    } else if (currentFilter === 'completed') {
      statusText = `完了：${completedCount}件`;
    } else if (currentFilter === 'incomplete') {
      statusText = `未完了：${incompleteCount}件`;
    }

    html += `
      <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <button onclick="toggleAccordion('${picker.id}')"
          class="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none">
          <div class="flex items-center gap-4">
            <h3 class="text-lg font-semibold text-gray-900">担当者：${picker.name}さん（${statusText}）</h3>
          </div>
          <svg id="accordion-icon-${picker.id}" xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-400 transform transition-transform duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div id="accordion-content-${picker.id}" class="hidden border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">受注No.</th>
                  <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">配送先</th>
                  <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">配送先住所</th>
                  <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">商品名</th>
                  <th scope="col" class="px-2 py-3 text-right text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">数量</th>
                  <th scope="col" class="pl-2 pr-6 py-3 text-center text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">Pick済</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${filteredPackages.length > 0 ? filteredPackages.map(pkg => `
                  <tr class="${pkg.picked ? 'bg-gray-100 text-gray-500' : ''}">
                    <td class="pl-6 pr-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${pkg.trackingNumber}</td>
                    <td class="px-2 py-4 text-sm text-gray-900">${pkg.recipient || ''}</td>
                    <td class="px-2 py-4 text-sm text-gray-900">${pkg.address || ''}</td>
                    <td class="px-2 py-4 text-sm text-gray-900">${pkg.productName}</td>
                    <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${pkg.quantity}</td>
                    <td class="pl-2 pr-6 py-4 whitespace-nowrap text-center">
                      <input type="checkbox"
                        class="picker-checkbox form-checkbox h-4 w-4 text-indigo-600"
                        data-package-id="${pkg.id}"
                        ${pkg.picked ? 'checked' : ''}>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">データなし</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html || '<div class="text-center text-gray-500 py-8">ピッキング者がいません</div>';

  // アコーディオンの開閉状態を復元または初期化
  Object.values(pickerPackagesMap).forEach(item => {
    const pickerId = item.picker.id;
    const content = document.getElementById(`accordion-content-${pickerId}`);
    const icon = document.getElementById(`accordion-icon-${pickerId}`);

    if (content && icon) {
      // 状態が記録されていない場合は初期状態として開く
      if (accordionStates[pickerId] === undefined) {
        accordionStates[pickerId] = true;
      }

      // 状態に応じて表示を設定
      if (accordionStates[pickerId]) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
      } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
      }
    }
  });
}

// 未割り当て荷物リストをレンダリング
function renderUnassignedPackages() {
  const tbody = document.getElementById('unassigned-packages-list');
  if (!tbody) return;

  const unassignedPackages = loadedPackages.filter(pkg => !pkg.assignedTo || pkg.assignedTo === '');

  if (unassignedPackages.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">データなし</td></tr>';
    return;
  }

  const html = unassignedPackages.map(pkg => `
    <tr class="${pkg.picked ? 'bg-gray-100 text-gray-500' : ''}">
      <td class="pl-6 pr-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${pkg.trackingNumber}</td>
      <td class="px-2 py-4 text-sm text-gray-900">${pkg.recipient || ''}</td>
      <td class="px-2 py-4 text-sm text-gray-900">${pkg.address || ''}</td>
      <td class="px-2 py-4 text-sm text-gray-900">${pkg.productName}</td>
      <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${pkg.quantity}</td>
      <td class="pl-2 pr-6 py-4 whitespace-nowrap text-center">
        <input type="checkbox"
          class="form-checkbox h-4 w-4 text-indigo-600 cursor-not-allowed opacity-50"
          ${pkg.picked ? 'checked' : ''}
          disabled>
      </td>
    </tr>
  `).join('');

  tbody.innerHTML = html;
}

// データを読み込んでレンダリング
async function loadAndRenderData() {
  const targetDate = sessionStorage.getItem('targetDate') || getTodayString();

  try {
    // 荷物データとユーザーデータを取得
    const [packages, users] = await Promise.all([
      api.getPackages(targetDate),
      api.getUsers(3) // 権限3: ピッキング担当者
    ]);

    loadedPackages = packages || [];
    loadedPickers = users || [];

    renderPickerAccordions();
    renderUnassignedPackages();
  } catch (error) {
    console.error('データ読み込みエラー:', error);
    const container = document.getElementById('picker-accordions-container');
    if (container) {
      container.innerHTML = '<div class="text-center text-red-500 py-8">データの読み込みに失敗しました</div>';
    }
  }
}

// リロードボタンの設定
function setupReloadButton() {
  const reloadButton = document.getElementById('reload-button');
  const reloadDialog = document.getElementById('reload-dialog');
  const reloadDialogOverlay = document.getElementById('reload-dialog-overlay');
  const reloadCancel = document.getElementById('reload-cancel');
  const reloadConfirm = document.getElementById('reload-confirm');

  if (!reloadButton || !reloadDialog) return;

  const openReloadDialog = () => {
    reloadDialog.classList.remove('hidden');
    reloadDialogOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeReloadDialog = () => {
    reloadDialog.classList.add('hidden');
    reloadDialogOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  };

  reloadButton.addEventListener('click', openReloadDialog);

  if (reloadCancel) {
    reloadCancel.addEventListener('click', closeReloadDialog);
  }

  if (reloadDialogOverlay) {
    reloadDialogOverlay.addEventListener('click', closeReloadDialog);
  }

  if (reloadConfirm) {
    reloadConfirm.addEventListener('click', async () => {
      closeReloadDialog();
      await loadAndRenderData();
    });
  }
}

// 保存ボタンの設定
function setupSaveButton() {
  const saveButton = document.getElementById('save-button');
  if (!saveButton) return;

  saveButton.addEventListener('click', async () => {
    try {
      await api.savePackages(loadedPackages);
      alert('保存しました');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
    }
  });
}

// チェックボックスのイベントハンドラー設定
function setupCheckboxHandlers() {
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('picker-checkbox') || e.target.classList.contains('unassigned-checkbox')) {
      const packageId = e.target.getAttribute('data-package-id');
      const isChecked = e.target.checked;

      const pkg = loadedPackages.find(p => p.id === packageId);
      if (pkg) {
        pkg.picked = isChecked;

        // 即座に再レンダリング
        renderPickerAccordions();
        renderUnassignedPackages();
      }
    }
  });
}

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
  initDateManagement();
  setupFilter();
  setupReloadButton();
  setupSaveButton();
  setupCheckboxHandlers();
  await loadAndRenderData();
});
