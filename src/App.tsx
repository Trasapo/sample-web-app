import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function App() {
  return (
    <Authenticator hideSignUp={true} components={{
      Footer: () => null // パスワードを忘れた場合のリンクを非表示にする
    }}>
      {({ signOut, user }) => (
        <main>
          <h1>こんにちは、 {user?.username} さん！</h1>
          <button onClick={signOut}>サインアウト</button>
        </main>
      )}
    </Authenticator>
  );
}