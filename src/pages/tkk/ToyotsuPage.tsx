type Props = {
  username: string;
  companyName: string;
  signOut: () => void;
};

export default function ToyotsuPage({ username, companyName, signOut }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">
            {companyName ? `${companyName} 様` : '豊通鋼管 様'}
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
            label="積載最適化"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            onClick={() => window.location.href = '/tkk/load-optimizer/index.html'}
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
