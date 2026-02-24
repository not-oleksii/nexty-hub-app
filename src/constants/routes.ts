export const ROUTES = {
  // Public routes
  home: '/',
  login: '/login',
  signup: '/signup',

  // Private routes
  discover: {
    root: '/discover',
    add: '/discover/add',
    type: (type: string) => `/discover/${type.toLowerCase()}`,
    item: (type: string, id: string) => `/discover/${type.toLowerCase()}/${id}`,
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
