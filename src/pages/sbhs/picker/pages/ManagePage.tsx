import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import { getPackages, getUsers, savePackages } from '../mockApi';
import type { Package, User } from '../types';

type Props = {
  username: string;
  targetDate: string;
  onDateChange: (date: string) => void;
  onLogout: () => void;
};

type FilterType = 'all' | 'completed' | 'incomplete';

export default function ManagePage({ username, targetDate, onDateChange, onLogout }: Props) {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [pickers, setPickers] = useState<User[]>([]);
  const [filter, setFilter] = useState<FilterType>('incomplete');
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showReloadDialog, setShowReloadDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    setPackages(getPackages(targetDate));
    setPickers(getUsers(3));
  };

  useEffect(() => { load(); }, [targetDate]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function toggleAccordion(pickerId: string) {
    setAccordionStates((prev) => ({ ...prev, [pickerId]: !prev[pickerId] }));
  }

  function togglePicked(packageId: string, checked: boolean) {
    setPackages((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, picked: checked } : p))
    );
  }

  function handleSave() {
    savePackages(packages);
    alert('保存しました');
  }

  // ピッカーごとに荷物をグループ化
  const pickerPackagesMap: Record<string, { picker: User; packages: Package[] }> = {};
  packages.forEach((pkg) => {
    if (pkg.assignedTo) {
      const picker = pickers.find((p) => p.id === pkg.assignedTo);
      if (picker) {
        if (!pickerPackagesMap[picker.id]) {
          pickerPackagesMap[picker.id] = { picker, packages: [] };
        }
        pickerPackagesMap[picker.id].packages.push(pkg);
      }
    }
  });

  function filterPkgs(pkgs: Package[]) {
    if (filter === 'completed') return pkgs.filter((p) => p.picked === true);
    if (filter === 'incomplete') return pkgs.filter((p) => p.picked !== true);
    return pkgs;
  }

  const unassignedPackages = packages.filter((p) => !p.assignedTo || p.assignedTo === '');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        targetDate={targetDate}
        onDateChange={onDateChange}
        username={username}
        onLogout={() => setShowLogoutDialog(true)}
      />

      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="ログアウト確認"
        message="ログアウトしてもよろしいですか？"
        confirmLabel="ログアウト"
        confirmClass="bg-red-600 hover:bg-red-700"
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={onLogout}
      />

      <ConfirmDialog
        isOpen={showReloadDialog}
        title="リロード確認"
        message={'データをリロードすると、保存していない変更はすべて失われます。\n\nよろしいですか？'}
        confirmLabel="リロード"
        confirmClass="bg-indigo-600 hover:bg-indigo-700"
        onCancel={() => setShowReloadDialog(false)}
        onConfirm={() => { setShowReloadDialog(false); load(); }}
      />

      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 h-16 sm:h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors" aria-label="サイドバー">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 flex justify-center relative" ref={dropdownRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setDropdownOpen((v) => !v); }}
              className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              ピッキング管理
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 min-w-[180px] z-50">
                <ul className="py-2">
                  <li><button onClick={() => { navigate('/sbhs/picker/assign'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">荷物割り当て</button></li>
                  <li><button onClick={() => { navigate('/sbhs/picker/picking'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">ピッキング</button></li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">すべて</option>
                <option value="completed">完了</option>
                <option value="incomplete">未完了</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button onClick={() => setShowReloadDialog(true)} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors" title="リロード">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button onClick={handleSave} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors" title="保存">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* ピッキング者アコーディオン */}
        <div className="space-y-3">
          {Object.values(pickerPackagesMap).length === 0 ? (
            <div className="text-center text-gray-500 py-8">ピッキング者がいません</div>
          ) : (
            Object.values(pickerPackagesMap).map(({ picker, packages: pkgs }) => {
              const filtered = filterPkgs(pkgs);
              if (filter !== 'all' && filtered.length === 0) return null;

              const totalCount = pkgs.length;
              const completedCount = pkgs.filter((p) => p.picked).length;
              const incompleteCount = totalCount - completedCount;

              let statusText = '';
              if (filter === 'all') statusText = `すべて：${totalCount}件`;
              else if (filter === 'completed') statusText = `完了：${completedCount}件`;
              else statusText = `未完了：${incompleteCount}件`;

              const isOpen = accordionStates[picker.id] !== false; // デフォルト開く

              return (
                <div key={picker.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(picker.id)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        担当者：{picker.name}さん（{statusText}）
                      </h3>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">受注No.</th>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">配送先</th>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">配送先住所</th>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">商品名</th>
                              <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">数量</th>
                              <th className="pl-2 pr-6 py-3 text-center text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">Pick済</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filtered.length === 0 ? (
                              <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">データなし</td></tr>
                            ) : (
                              filtered.map((pkg) => (
                                <tr key={pkg.id} className={pkg.picked ? 'bg-gray-100 text-gray-500' : ''}>
                                  <td className="pl-6 pr-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.trackingNumber}</td>
                                  <td className="px-2 py-4 text-sm text-gray-900">{pkg.recipient}</td>
                                  <td className="px-2 py-4 text-sm text-gray-900">{pkg.address}</td>
                                  <td className="px-2 py-4 text-sm text-gray-900">{pkg.productName}</td>
                                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{pkg.quantity}</td>
                                  <td className="pl-2 pr-6 py-4 whitespace-nowrap text-center">
                                    <input
                                      type="checkbox"
                                      className="form-checkbox h-4 w-4 text-indigo-600"
                                      checked={pkg.picked}
                                      onChange={(e) => togglePicked(pkg.id, e.target.checked)}
                                    />
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 未割り当て荷物リスト */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">未割り当て荷物</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">受注No.</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">配送先</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">配送先住所</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">商品名</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">数量</th>
                  <th className="pl-2 pr-6 py-3 text-center text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">Pick済</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {unassignedPackages.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">データなし</td></tr>
                ) : (
                  unassignedPackages.map((pkg) => (
                    <tr key={pkg.id} className={pkg.picked ? 'bg-gray-100 text-gray-500' : ''}>
                      <td className="pl-6 pr-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.trackingNumber}</td>
                      <td className="px-2 py-4 text-sm text-gray-900">{pkg.recipient}</td>
                      <td className="px-2 py-4 text-sm text-gray-900">{pkg.address}</td>
                      <td className="px-2 py-4 text-sm text-gray-900">{pkg.productName}</td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.quantity}</td>
                      <td className="pl-2 pr-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-indigo-600 cursor-not-allowed opacity-50"
                          checked={pkg.picked}
                          disabled
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-end text-sm text-slate-500">
          © TransSupporter
        </div>
      </footer>
    </div>
  );
}
