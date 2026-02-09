export const ROUTES = {
  // Public routes
  home: '/',
  login: '/login',
  signup: '/signup',

  // Private routes
  discoverList: {
    root: '/discover-list',
    add: '/discover-list/add',
    item: '/discover-list/:type/:id',
  },
  lists: {
    root: '/lists',
  },
} as const;
