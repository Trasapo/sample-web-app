# sample-web-app 仕様書

## 概要

AWS Amplify Gen2 を使用した管理者管理型の認証付き Web アプリケーション。

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| フロントエンド | React 19 + TypeScript |
| ビルドツール | Vite |
| バックエンド | AWS Amplify Gen2 |
| 認証 | Amazon Cognito (AWS Amplify Auth) |
| データ | AWS AppSync + DynamoDB (Amplify Data) |
| UI コンポーネント | @aws-amplify/ui-react |

---

## 認証仕様

### ログイン方式

- **識別子**: ユーザーID（ユーザー名）
- **認証**: パスワード
- メールアドレスによるログインは不可

### ユーザー管理方針

- ユーザーの作成・パスワード設定は **Web 管理者が実施**
- ユーザー自身によるサインアップは **禁止**（`hideSignUp={true}`）
- ユーザー自身による認証情報の変更は **不可**
- パスワードリセットリンクは非表示

### ユーザーグループ

| グループ名 | 用途 |
|---|---|
| AdminGroup | 管理者 |
| UserGroupA | 一般ユーザー |

---

## 管理者によるユーザー作成手順

Cognito コンソールまたは AWS CLI で実施する。

### AWS CLI の場合

```bash
# 1. ユーザー作成（確認メール送信なし）
aws cognito-idp admin-create-user \
  --user-pool-id <USER_POOL_ID> \
  --username <ユーザーID> \
  --message-action SUPPRESS

# 2. 永続パスワードを設定（初回ログイン時の変更要求なし）
aws cognito-idp admin-set-user-password \
  --user-pool-id <USER_POOL_ID> \
  --username <ユーザーID> \
  --password <パスワード> \
  --permanent

# 3. グループへの追加（必要に応じて）
aws cognito-idp admin-add-user-to-group \
  --user-pool-id <USER_POOL_ID> \
  --username <ユーザーID> \
  --group-name AdminGroup
```

> **注意**: `--permanent` フラグを必ず指定すること。省略すると初回ログイン時にユーザーへパスワード変更を求める画面が表示される。

---

## 画面仕様

### ログイン画面

| 項目 | 内容 |
|---|---|
| ユーザーID フィールド | ラベル「ユーザーID」、プレースホルダー「IDを入力してください」 |
| パスワード フィールド | デフォルト表示 |
| サインアップリンク | 非表示 |
| パスワードを忘れた場合のリンク | 表示（非表示にしない） |

### ログイン後画面

- ログイン中のユーザー名を表示（`こんにちは、{username} さん！`）
- サインアウトボタン

---

## バックエンド構成

### 認証 (`amplify/auth/resource.ts`)

```typescript
defineAuth({
  loginWith: { email: true },  // Amplify Gen2 API の制約上必要
  groups: ["AdminGroup", "UserGroupA"],
});
```

### CDK オーバーライド (`amplify/backend.ts`)

Amplify Gen2 の API 制約により `loginWith.email: true` が必須だが、
実際は **ユーザー名認証** を使用するため CDK レベルでオーバーライドしている。

```typescript
cfnUserPool.addPropertyOverride('UsernameAttributes', []);  // username を主識別子に
cfnUserPool.addPropertyOverride('AliasAttributes', []);     // エイリアスなし
```

### データ (`amplify/data/resource.ts`)

- `Todo` モデル（content フィールド）
- 認証モード: Identity Pool
- アクセス権限: ゲスト許可（現状）

---

## デプロイ

AWS Amplify コンソールの CI/CD パイプラインで自動デプロイ。

| ブランチ | 環境 |
|---|---|
| feature | 開発 |
| main | 本番（予定） |

ビルドコマンド:
1. `npm ci` - 依存パッケージインストール
2. `npx ampx pipeline-deploy` - バックエンドデプロイ
3. `npm run build` - フロントエンドビルド
