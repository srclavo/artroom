export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  design: (id: string) => `/design/${id}`,
  studio: (username: string) => `/studio/${username}`,
  portfolio: (id: string) => `/portfolio/${id}`,
  jobs: '/jobs',
  job: (id: string) => `/jobs/${id}`,
  dashboard: '/dashboard',
  dashboardUploads: '/dashboard/uploads',
  dashboardEarnings: '/dashboard/earnings',
  dashboardSettings: '/dashboard/settings',
} as const;
