import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data,
});

// Amplify Gen2 APIの制約でloginWith.emailが必要だが、
// 実際はusername+password認証を使うためCDKでオーバーライド
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.addPropertyOverride('UsernameAttributes', []);
cfnUserPool.addPropertyOverride('AliasAttributes', []);
