import { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';

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

  return (
    <main>
      <h1>こんにちは、{user.username} さん！</h1>
      {isAdmin && <p>管理者ページです</p>}
      {!isAdmin && companyName && <p>{companyName}ページです</p>}
      <button onClick={signOut}>サインアウト</button>
    </main>
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