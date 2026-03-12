import { useNavigate } from 'react-router-dom';
import { COMPANIES } from '../../config/companies';

type Props = {
  username: string;
  signOut: () => void;
};

export default function AdminPage({ username, signOut }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">管理者ページ</h1>
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

      <main className="flex-1 w-full px-4 sm:px-6 py-10 space-y-10">

        {/* 会社一覧 */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">会社一覧</h2>
          <div className="flex flex-wrap gap-4">
            {COMPANIES.map((company) => (
              <button
                key={company.id}
                onClick={() => navigate(company.path)}
                className="w-36 h-36 bg-white rounded-2xl shadow border border-slate-200 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-indigo-300 hover:text-indigo-600 transition-all text-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V7a2 2 0 012-2h3V3h8v2h3a2 2 0 012 2v14M9 21v-6h6v6M3 21h18" />
                </svg>
                <span className="text-sm font-medium text-center leading-tight">{company.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 管理機能（今後追加予定） */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">管理機能</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-36 h-36 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-center leading-tight">機能追加予定</span>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="w-full px-6 h-12 flex items-center justify-end text-sm text-slate-500">
          © TransSupporter
        </div>
      </footer>
    </div>
  );
}
