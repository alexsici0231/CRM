export type UserRole = 'admin' | 'manager' | 'viewer';

export interface AppUser {
  name: string;
  title: string;
  role: UserRole;
  avatar: string;
}

export const rolePermissions: Record<UserRole, { canManage: boolean; canDelete: boolean }> = {
  admin: { canManage: true, canDelete: true },
  manager: { canManage: true, canDelete: false },
  viewer: { canManage: false, canDelete: false },
};

export const defaultUser: AppUser = {
  name: 'Алекс Джонсон',
  title: 'Менеджер',
  role: 'admin',
  avatar: '/assets/avatar-alex.jpg',
};
