import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type NavItem = { label: string; path: string };

type Props = {
  title: string;
  navItems: NavItem[];
  onReload?: () => void;
  onSave?: () => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
};

export default function AppHeader({ title, navItems, onReload, onSave, filterValue, onFilterChange }: Props) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 h-16 sm:h-14 flex items-center gap-3">
        {/* ハンバーガーメニュー（サイドバーはPickerAppで管理） */}
        <div className="flex items-center">
          <button
            id="sidebar-toggle-btn"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="サイドバー"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* タイトルドロップダウン */}
        <div className="flex-1 flex justify-center relative" ref={dropdownRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setDropdownOpen((v) => !v); }}
            className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            {title}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 min-w-[180px] z-50">
              <ul className="py-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => { navigate(item.path); setDropdownOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 右側ボタン群 */}
        <div className="relative flex items-center gap-3">
          {onFilterChange && filterValue !== undefined && (
            <div className="relative">
              <select
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
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
          )}
          {onReload && (
            <button
              onClick={onReload}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label="リロード"
              title="リロード"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label="保存"
              title="保存"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
