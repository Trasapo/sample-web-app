import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';
import AdminPage from './pages/admin/AdminPage';
import SbhsPage from './pages/sbhs/SbhsPage';

function AuthenticatedApp({ signOut, user }: { signOut: () => void; user: { username: string } }) {
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

  if (groups.length === 0) return null;

  return (
    <Router>
      <Routes>
        {isAdmin && <Route path="/admin" element={<AdminPage username={user.username} signOut={signOut} />} />}
        {!isAdmin && <Route path="/sbhs" element={<SbhsPage username={user.username} companyName={companyName} signOut={signOut} />} />}
        <Route path="*" element={<Navigate to={isAdmin ? '/admin' : '/sbhs'} replace />} />
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