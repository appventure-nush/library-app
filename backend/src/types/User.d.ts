import { Optional } from './common';

export enum Role {
  STUDENT = 1,
  TEACHER = 11,
  LIBRARIAN = 12,
  ADMIN = 100,
}

export interface UserAttributes {
  id: number;
  name: string;
  role: Role;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export interface UserUpdateData extends Omit<UserAttributes, 'id'> {}
