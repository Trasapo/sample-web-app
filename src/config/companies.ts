export type Company = {
  id: string;
  name: string;
  path: string;
  group: string;
};

export const COMPANIES: Company[] = [
  { id: 'sbhs', name: '柴橋商会', path: '/sbhs', group: 'UserGroupA' },
  { id: 'tkk', name: '豊通鋼管', path: '/tkk', group: 'UserGroupB' },
];
