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
    create: '/lists/create',
    detail: (id: string) => `/lists/${id}`,
    edit: (id: string) => `/lists/${id}/edit`,
  },
  randomPick: {
    root: '/random-pick',
  },
} as const;
