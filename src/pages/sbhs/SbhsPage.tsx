import { Route, Routes, useNavigate } from 'react-router-dom';
import PickerApp from './picker/PickerApp';

type Props = {
  username: string;
  companyName: string;
  signOut: () => void;
  isAdmin: boolean;
};

export default function SbhsPage({ username, companyName, signOut, isAdmin }: Props) {
  return (
    <Routes>
      <Route
        index
        element={<SbhsHome username={username} companyName={companyName} signOut={signOut} isAdmin={isAdmin} />}
      />
      <Route path="picker/*" element={<PickerApp username={username} />} />
    </Routes>
  );
}

type HomeProps = {
  username: string;
  companyName: string;
  signOut: () => void;
  isAdmin: boolean;
};

function SbhsHome({ username, companyName, signOut, isAdmin }: HomeProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">
            {companyName || 'ホーム'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{username}</span>
            <button
              onClick={signOut}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <p className="text-slate-500 text-sm mb-6">ツールを選択してください</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <TileButton
            label="ピッキングツール"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            onClick={() => navigate('/sbhs/picker')}
          />
          {isAdmin && (
            <TileButton
              label="管理者ページ"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              onClick={() => navigate('/admin')}
            />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-end text-sm text-slate-500">
          © TransSupporter
        </div>
      </footer>
    </div>
  );
}

type TileButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

function TileButton({ label, icon, onClick }: TileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow border border-slate-200 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all text-slate-700"
    >
      {icon}
      <span className="text-sm font-medium text-center">{label}</span>
    </button>
  );
}
