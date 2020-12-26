export enum Role {
  STUDENT = 1,
  TEACHER = 11,
  LIBRARIAN = 12,
  ADMIN = 100,
}

export const roleString: Record<Role, string> = {
  1: 'student',
  11: 'teacher',
  12: 'librarian',
  100: 'admin',
};

export interface UserListData {
  id: number;
  name: string;
  role: Role;
}

export interface UserData extends UserListData {}
