import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: false,     // メールログインを使わない
    userName: true,    // ユーザー名（ID）ログインを使う
  },
  userAttributes: {
    email: {
      required: false, // メールアドレスを必須にしない
    },
  },
  groups: ["AdminGroup", "UserGroupA"],
});