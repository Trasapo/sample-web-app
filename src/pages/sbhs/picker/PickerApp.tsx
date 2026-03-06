import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AssignPage from './pages/AssignPage';
import ManagePage from './pages/ManagePage';
import PickingPage from './pages/PickingPage';

type Props = {
  username: string;
};

function getTodayString(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function PickerHome({ username }: { username: string }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">ピッキングツール</h1>
          <span className="text-sm text-slate-600">{username}</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <p className="text-slate-500 text-sm mb-6">ページを選択してください</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('assign')}
            className="bg-white rounded-2xl shadow border border-slate-200 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-sm font-medium text-center">荷物割り当て</span>
          </button>
          <button
            onClick={() => navigate('manage')}
            className="bg-white rounded-2xl shadow border border-slate-200 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-center">ピッキング管理</span>
          </button>
          <button
            onClick={() => navigate('picking')}
            className="bg-white rounded-2xl shadow border border-slate-200 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-center">ピッキング</span>
          </button>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between text-sm text-slate-500">
          <button
            onClick={() => navigate('/sbhs')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← ホームへ戻る
          </button>
          © TransSupporter
        </div>
      </footer>
    </div>
  );
}

export default function PickerApp({ username }: Props) {
  const navigate = useNavigate();
  const [targetDate, setTargetDate] = useState<string>(() => {
    return sessionStorage.getItem('targetDate') || getTodayString();
  });

  useEffect(() => {
    sessionStorage.setItem('targetDate', targetDate);
  }, [targetDate]);

  const sharedProps = {
    username,
    targetDate,
    onDateChange: setTargetDate,
    onLogout: () => navigate(''),
  };

  return (
    <Routes>
      <Route index element={<PickerHome username={username} />} />
      <Route path="assign" element={<AssignPage {...sharedProps} />} />
      <Route path="manage" element={<ManagePage {...sharedProps} />} />
      <Route path="picking" element={<PickingPage {...sharedProps} />} />
    </Routes>
  );
}
