import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession, signOut as amplifySignOut } from 'aws-amplify/auth';
import AdminPage from './pages/admin/AdminPage';
import SbhsPage from './pages/sbhs/SbhsPage';
import ToyotsuPage from './pages/tkk/ToyotsuPage';
import { COMPANIES } from './config/companies';

function AuthenticatedApp({ user }: { signOut: () => void; user: { username: string } }) {
  const signOut = async () => {
    await amplifySignOut();
    window.location.replace('/');
  };
  const [groups, setGroups] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuthSession().then((session) => {
      const payload = session.tokens?.idToken?.payload;
      const userGroups = (payload?.['cognito:groups'] as string[]) ?? [];
      setGroups(userGroups);
      setCompanyName((payload?.['custom:company_name'] as string) ?? '');
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const isAdmin = groups.includes('AdminGroup');
  const company = COMPANIES.find(c => groups.includes(c.group));
  const defaultPath = isAdmin ? '/admin' : (company?.path ?? '/sbhs');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // もしグループが1つも割り当てられていない場合（事前ログイン時のキャッシュなど）
  // ログアウトできるように最低限のUIを表示する
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">権限グループが設定されていません。再度ログインをお試しください。</p>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={isAdmin ? <AdminPage username={user.username} signOut={signOut} /> : <Navigate to={defaultPath} replace />} />
        <Route path="/sbhs/*" element={<SbhsPage username={user.username} companyName={companyName || (COMPANIES.find(c => c.id === 'sbhs')?.name ?? '')} signOut={signOut} />} />
        <Route path="/tkk/*" element={<ToyotsuPage username={user.username} companyName={companyName || (COMPANIES.find(c => c.id === 'tkk')?.name ?? '')} signOut={signOut} />} />
        <Route path="*" element={<Navigate to={defaultPath} replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <Authenticator
      hideSignUp={true}
      formFields={{
        signIn: {
          username: {
            label: 'ユーザーID',
            placeholder: 'IDを入力してください',
            type: 'text',
          },
        },
      }}
      components={{
        SignIn: {
          Footer: () => null,
        },
      }}
    >
      {({ signOut, user }) => (
        <AuthenticatedApp signOut={signOut!} user={user!} />
      )}
    </Authenticator>
  );
}