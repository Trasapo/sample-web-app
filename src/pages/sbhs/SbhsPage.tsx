type Props = {
  username: string;
  companyName: string;
  signOut: () => void;
};

export default function SbhsPage({ username, companyName, signOut }: Props) {
  return (
    <main>
      <h1>こんにちは、{username} さん！</h1>
      <p>{companyName}ページです</p>
      <button onClick={signOut}>サインアウト</button>
    </main>
  );
}
