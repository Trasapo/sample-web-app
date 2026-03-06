import { Link } from 'react-router-dom';

type Props = {
  username: string;
  signOut: () => void;
};

export default function AdminPage({ username, signOut }: Props) {
  return (
    <main>
      <h1>こんにちは、{username} さん！</h1>
      <p>管理者ページです</p>
      <Link to="/sbhs">ホームへ戻る</Link>
      <button onClick={signOut}>サインアウト</button>
    </main>
  );
}
