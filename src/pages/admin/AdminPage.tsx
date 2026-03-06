type Props = {
  username: string;
  signOut: () => void;
};

export default function AdminPage({ username, signOut }: Props) {
  return (
    <main>
      <h1>こんにちは、{username} さん！</h1>
      <p>管理者ページです</p>
      <button onClick={signOut}>サインアウト</button>
    </main>
  );
}
