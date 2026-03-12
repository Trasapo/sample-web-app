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
