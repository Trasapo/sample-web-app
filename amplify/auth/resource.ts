import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    // email: { required: false } // userNameログインのみの場合は不要
    "custom:company_name": {
      dataType: "String",
      mutable: true,
    },
  },
  groups: ["AdminGroup", "UserGroupA", "UserGroupB"],
});