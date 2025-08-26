export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'provisioning' | 'schoolAdmin' | 'schoolManager' | 'clerk';
  subscriptions: {
    billing: boolean;
    reports: boolean;
    kanban: boolean;
  };
}

export type AuthState = 'login' | 'register' | 'forgot-password';

export interface NavigationItem {
  id: string;
  name: string;
  icon: string;
  roles: Array<User['role']>;
  requiresSubscription?: keyof User['subscriptions'];
}