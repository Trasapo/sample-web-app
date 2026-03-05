import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: undefined,
    userName: true,
  },
  userAttributes: {
    // email: { required: false } // userNameログインのみの場合は不要
  },
  groups: ["AdminGroup", "UserGroupA"],
});