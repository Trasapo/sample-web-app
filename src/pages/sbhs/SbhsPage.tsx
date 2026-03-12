import { Route, Routes } from 'react-router-dom';
import PickerApp from './picker/PickerApp';

type Props = {
  username: string;
  companyName: string;
  signOut: () => void;
};

export default function SbhsPage({ username, companyName, signOut }: Props) {
  return (
    <Routes>
      <Route
        index
        element={<SbhsHome username={username} companyName={companyName} signOut={signOut} />}
      />
      <Route path="picker/*" element={<PickerApp username={username} />} />
    </Routes>
  );
}

type HomeProps = {
  username: string;
  companyName: string;
  signOut: () => void;
};

function SbhsHome({ username, companyName, signOut }: HomeProps) {

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">
            {companyName ? `${companyName} 様` : 'ホーム'}
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

      <main className="flex-1 w-full px-4 sm:px-6 py-10">
        <div className="flex flex-wrap gap-4">
          <TileButton
            label="ピッキングツール"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            onClick={() => window.location.href = '/sbhs/picker-tool/index.html'}
          />
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
      className="w-36 h-36 bg-white rounded-2xl shadow border border-slate-200 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-indigo-300 hover:text-indigo-600 transition-all text-slate-600"
    >
      {icon}
      <span className="text-sm font-medium text-center leading-tight">{label}</span>
    </button>
  );
}
