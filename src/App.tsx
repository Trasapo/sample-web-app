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

  useEffect(() => {
    fetchAuthSession().then((session) => {
      const payload = session.tokens?.idToken?.payload;
      const userGroups = (payload?.['cognito:groups'] as string[]) ?? [];
      setGroups(userGroups);
      setCompanyName((payload?.['custom:company_name'] as string) ?? '');
    });
  }, []);

  const isAdmin = groups.includes('AdminGroup');
  const company = COMPANIES.find(c => groups.includes(c.group));
  const defaultPath = isAdmin ? '/admin' : (company?.path ?? '/sbhs');

  if (groups.length === 0) return null;

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={isAdmin ? <AdminPage username={user.username} signOut={signOut} /> : <Navigate to={defaultPath} replace />} />
        <Route path="/sbhs/*" element={<SbhsPage username={user.username} companyName={companyName || (COMPANIES.find(c => c.id === 'sbhs')?.name ?? '')} signOut={signOut} isAdmin={isAdmin} />} />
        <Route path="/tkk/*" element={<ToyotsuPage username={user.username} companyName={companyName || (COMPANIES.find(c => c.id === 'tkk')?.name ?? '')} signOut={signOut} isAdmin={isAdmin} />} />
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