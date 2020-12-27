export enum Role {
  STUDENT = 1,
  TEACHER = 11,
  LIBRARIAN = 12,
  ADMIN = 100,
}

export const roleString: Record<Role, string> = {
  1: 'Student',
  11: 'Teacher',
  12: 'Librarian',
  100: 'Admin',
};

export const roleColor: Record<Role, string> = {
  1: 'green',
  11: 'volcano',
  12: 'geekblue',
  100: 'gold',
};

export interface UserListData {
  id: number;
  name: string;
  role: Role;
}

export interface UserData extends UserListData {}
