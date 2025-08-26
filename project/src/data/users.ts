import { User } from '../types';

export const usersDb: User[] = [
  {
    id: '1',
    name: 'John Provisioner',
    email: 'john@provisioning.com',
    password: 'password123',
    role: 'provisioning',
    subscriptions: {
      billing: true,
      reports: true,
      kanban: true
    }
  },
  {
    id: '2',
    name: 'Sarah Admin',
    email: 'sarah@school.edu',
    password: 'password123',
    role: 'schoolAdmin',
    subscriptions: {
      billing: true,
      reports: true,
      kanban: false
    }
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'mike@school.edu',
    password: 'password123',
    role: 'schoolManager',
    subscriptions: {
      billing: false,
      reports: true,
      kanban: true
    }
  },
  {
    id: '4',
    name: 'Lisa Clerk',
    email: 'lisa@school.edu',
    password: 'password123',
    role: 'clerk',
    subscriptions: {
      billing: true,
      reports: false,
      kanban: true
    }
  }
];