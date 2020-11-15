export enum Role {
  STUDENT = 1,
  TEACHER = 11,
  LIBRARIAN = 12,
  ADMIN = 100,
}

export interface UserData {
  id: number;
  name: string;
  role: Role;
}
