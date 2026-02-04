export const ROUTES = {
  home: '/',
  login: '/login',
  discoverList: {
    root: '/discover-list',
    add: '/discover-list/add',
    item: '/discover-list/:type/:id',
  },
} as const;
