type Props = {
  isOpen: boolean;
  onClose: () => void;
  targetDate: string;
  onDateChange: (date: string) => void;
  username: string;
  onLogout: () => void;
};

export default function AppSidebar({ isOpen, onClose, targetDate, onDateChange, username, onLogout }: Props) {
  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 sm:w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">メニュー</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="閉じる"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 flex flex-col flex-1">
          {/* 日付選択 */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
          </div>

          <ul className="space-y-2 border-t border-slate-200 pt-4 mt-auto">
            <li>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                ログアウト
              </button>
            </li>
            <li>
              <div className="block px-4 py-2 text-slate-700">{username}</div>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
