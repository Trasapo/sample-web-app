import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import { getPackages, getUsers, savePackages } from '../mockApi';
import { Package } from '../types';

type Props = {
  username: string;
  targetDate: string;
  onDateChange: (date: string) => void;
  onLogout: () => void;
};

export default function PickingPage({ username, targetDate, onDateChange, onLogout }: Props) {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [myPackages, setMyPackages] = useState<Package[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showReloadDialog, setShowReloadDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 現在ログイン中のユーザーIDを解決（Cognitoのusernameが直接IDと一致する想定）
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const load = async () => {
    const users = getUsers();
    const user = users.find((u) => u.name === username) || users.find((u) => u.id === username);
    const userId = user?.id ?? username;
    setCurrentUserId(userId);

    const allPkgs = getPackages(targetDate);
    setPackages(allPkgs);
    setMyPackages(allPkgs.filter((p) => String(p.assignedTo) === String(userId)));
  };

  useEffect(() => { load(); }, [targetDate, username]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function togglePicked(packageId: string, checked: boolean) {
    setMyPackages((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, picked: checked } : p))
    );
    setPackages((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, picked: checked } : p))
    );
  }

  function handleSave() {
    // ピッキング状態を全体パッケージに反映して保存
    const merged = packages.map((pkg) => {
      const mine = myPackages.find((m) => m.id === pkg.id);
      return mine ?? pkg;
    });
    savePackages(merged);
    alert('保存しました');
  }

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
              ピッキング
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 min-w-[180px] z-50">
                <ul className="py-2">
                  <li><button onClick={() => { navigate('/sbhs/picker/assign'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">荷物割り当て</button></li>
                  <li><button onClick={() => { navigate('/sbhs/picker/manage'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">ピッキング管理</button></li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
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

      <main className="flex-1 w-full mx-auto px-0 py-0 flex flex-col" id="picking-main-container">
        <div className="bg-white border-b border-gray-200 overflow-hidden flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">受注No.</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">商品名</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">数量</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">配送先住所/配送先</th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap">Pick済</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myPackages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    担当する荷物はありません
                  </td>
                </tr>
              ) : (
                myPackages.map((pkg) => (
                  <PickingRow key={pkg.id} pkg={pkg} onToggle={togglePicked} />
                ))
              )}
            </tbody>
          </table>
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

type PickingRowProps = {
  pkg: Package;
  onToggle: (id: string, checked: boolean) => void;
};

function PickingRow({ pkg, onToggle }: PickingRowProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const touchStartY = useRef(0);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const scrollDist = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (scrollDist < 10 && e.target !== checkboxRef.current) {
      e.preventDefault();
      onToggle(pkg.id, !pkg.picked);
    }
  }

  function handleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).tagName !== 'INPUT') {
      onToggle(pkg.id, !pkg.picked);
    }
  }

  return (
    <tr
      className={`cursor-pointer hover:bg-gray-50 transition-colors ${pkg.picked ? 'bg-gray-100 text-gray-500' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <td className="px-2 py-3 text-sm text-gray-900 align-top break-all max-w-[80px]">{pkg.trackingNumber}</td>
      <td className="px-2 py-3 text-sm text-gray-900 align-top">{pkg.productName}</td>
      <td className="px-2 py-3 text-sm text-gray-900 align-top text-center">{pkg.quantity}</td>
      <td className="px-2 py-3 text-sm text-gray-900 align-top text-xs">
        <div className="line-clamp-2" title={pkg.address}>{pkg.address}</div>
        <div className="text-gray-500 mt-1 text-[10px]">{pkg.recipient}</div>
      </td>
      <td className="px-2 py-3 align-top text-center">
        <label className="inline-flex items-center cursor-pointer">
          <input
            ref={checkboxRef}
            type="checkbox"
            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out cursor-pointer"
            checked={pkg.picked}
            onChange={(e) => onToggle(pkg.id, e.target.checked)}
          />
        </label>
      </td>
    </tr>
  );
}
