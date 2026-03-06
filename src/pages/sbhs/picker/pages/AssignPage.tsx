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

export default function AssignPage({ username, targetDate, onDateChange, onLogout }: Props) {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUnassignedOpen, setIsUnassignedOpen] = useState(true);
  const [isAssignerListExpanded, setIsAssignerListExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showReloadDialog, setShowReloadDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const assignerScrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const load = () => {
    setPackages(getPackages(targetDate));
    setUsers(getUsers(3));
    setSelectedUserId(null);
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

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const assignerPackages = packages.filter((p) => String(p.assignedTo) === String(selectedUserId));
  const unassignedPackages = packages.filter((p) => !p.assignedTo || p.assignedTo === '');
  const headerDate = targetDate ? targetDate.replace(/-/g, '/') : '';

  function assignPackage(packageId: string, assignerId: string) {
    setPackages((prev) => {
      const idx = prev.findIndex((p) => p.id === packageId);
      if (idx === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(idx, 1);
      updated.push({ ...moved, assignedTo: assignerId });
      setTimeout(() => {
        if (assignerScrollRef.current) {
          assignerScrollRef.current.scrollTop = assignerScrollRef.current.scrollHeight;
        }
      }, 50);
      return updated;
    });
  }

  function unassignPackage(packageId: string) {
    setPackages((prev) => prev.map((p) => (p.id === packageId ? { ...p, assignedTo: '' } : p)));
  }

  function handleSave() {
    savePackages(packages);
    setShowSaveDialog(true);
  }

  return (
    <div className="fixed inset-0 bg-slate-100 flex flex-col overflow-auto">
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

      <ConfirmDialog
        isOpen={showSaveDialog}
        title="保存完了"
        message="保存しました。"
        confirmLabel="OK"
        confirmClass="bg-indigo-600 hover:bg-indigo-700"
        onCancel={() => setShowSaveDialog(false)}
        onConfirm={() => setShowSaveDialog(false)}
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
              荷物割り当て
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 min-w-[180px] z-50">
                <ul className="py-2">
                  <li><button onClick={() => { navigate('/sbhs/picker/manage'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">ピッキング管理</button></li>
                  <li><button onClick={() => { navigate('/sbhs/picker/picking'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">ピッキング</button></li>
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* 担当者荷物リスト */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-white relative flex items-center justify-center min-h-[60px]">
            <span className="absolute left-6 text-base font-medium text-gray-600">
              {selectedUser ? `${selectedUser.name} さんの担当分` : '未選択'}
            </span>
            <h2 className="text-xl font-bold text-gray-900">担当者荷物リスト</h2>
            <button
              onClick={() => setIsAssignerListExpanded((v) => !v)}
              className={`absolute right-6 text-gray-500 hover:text-gray-700 focus:outline-none transition-transform duration-200 ${isAssignerListExpanded ? 'rotate-180' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div
            ref={assignerScrollRef}
            className={`overflow-x-auto overflow-y-auto ${isAssignerListExpanded ? '' : 'h-[12.5rem]'}`}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">受注No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">個数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">配送先</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">配送先住所</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedUserId === null ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">担当者を選択してください</td></tr>
                ) : assignerPackages.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">担当する荷物はありません</td></tr>
                ) : (
                  assignerPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => unassignPackage(pkg.id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{pkg.trackingNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{pkg.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.recipient}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={pkg.address}>{pkg.address}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 担当者リスト */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">担当者リスト</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {users.length === 0 ? (
              <div className="text-gray-400 text-sm">読み込み中...</div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium focus:outline-none transition-colors ${
                    selectedUserId === user.id
                      ? 'bg-blue-500 border border-blue-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {user.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 未割り当て荷物リスト */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <button
            onClick={() => setIsUnassignedOpen((v) => !v)}
            className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none relative min-h-[64px]"
          >
            <span className="text-lg font-medium text-gray-500 z-10">{headerDate}</span>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h1 className="text-xl font-bold text-gray-900">未割り当て荷物リスト</h1>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 text-gray-400 transform transition-transform duration-200 ${isUnassignedOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isUnassignedOpen && (
            <div className="overflow-x-auto border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">受注No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">商品名</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">個数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">配送先</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">配送先住所</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unassignedPackages.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">未割り当ての荷物はありません</td></tr>
                  ) : (
                    unassignedPackages.map((pkg) => (
                      <tr
                        key={pkg.id}
                        className={`hover:bg-gray-50 transition-colors ${selectedUserId ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => { if (selectedUserId) assignPackage(pkg.id, selectedUserId); }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{pkg.trackingNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{pkg.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.recipient}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={pkg.address}>{pkg.address}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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
