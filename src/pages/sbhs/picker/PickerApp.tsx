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

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function DateDialog({ initialDate, onConfirm }: { initialDate: string; onConfirm: (date: string) => void }) {
  const [selected, setSelected] = useState(initialDate);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center">日付を選択してください</h3>

        <div className="flex justify-center bg-slate-50 p-4 rounded-lg">
          <input
            type="date"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="text-base border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setSelected((d) => addDays(d, -1))}
            className="flex-1 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            前日
          </button>
          <button
            onClick={() => setSelected(getTodayString())}
            className="flex-1 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
          >
            今日
          </button>
          <button
            onClick={() => setSelected((d) => addDays(d, 1))}
            className="flex-1 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
          >
            翌日
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onConfirm(selected)}
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          決定
        </button>
      </div>
    </div>
  );
}

function PickerHome({ onLogin }: { onLogin: (role: 'assign' | 'picking', userId?: string) => void }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-auto">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">ログイン</h1>
            <p className="text-gray-600">アカウントにログインしてください</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ユーザー名</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="ユーザー名を入力"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="パスワードを入力"
              />
            </div>

            <button
              onClick={() => onLogin('assign')}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              ログイン (管理者/割り当て担当)
            </button>

            <button
              onClick={() => onLogin('picking', '1000000003')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mt-4"
            >
              高橋さんでログイン (ピッキング担当)
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>© TransSupporter</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PickerApp({ username }: Props) {
  const navigate = useNavigate();
  const [targetDate, setTargetDate] = useState<string>(() => {
    return sessionStorage.getItem('targetDate') || getTodayString();
  });
  const [pendingRole, setPendingRole] = useState<'assign' | 'picking' | null>(null);
  const [pickerUserId, setPickerUserId] = useState<string>('');

  useEffect(() => {
    sessionStorage.setItem('targetDate', targetDate);
  }, [targetDate]);

  function handleLogin(role: 'assign' | 'picking', userId?: string) {
    if (userId) setPickerUserId(userId);
    navigate(role);
    setPendingRole(role);
  }

  function handleDateConfirm(date: string) {
    setTargetDate(date);
    setPendingRole(null);
  }

  const sharedProps = {
    username,
    targetDate,
    onDateChange: setTargetDate,
    onLogout: () => navigate('/sbhs/picker'),
  };

  return (
    <>
      {pendingRole !== null && (
        <DateDialog initialDate={getTodayString()} onConfirm={handleDateConfirm} />
      )}
      <Routes>
        <Route index element={<PickerHome onLogin={handleLogin} />} />
        <Route path="assign" element={<AssignPage {...sharedProps} />} />
        <Route path="manage" element={<ManagePage {...sharedProps} />} />
        <Route path="picking" element={<PickingPage {...sharedProps} username={pickerUserId || username} />} />
      </Routes>
    </>
  );
}
