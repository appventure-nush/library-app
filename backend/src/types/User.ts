import { Optional } from './common';
import { InfringmentData } from './Infringement';

export enum Role {
  STUDENT = 1,
  STAFF = 11,
  LIBRARIAN = 12,
  ADMIN = 100,
}

export interface UserAttributes {
  id: string;
  azureOid: string;
  name: string;
  email: string;
  role: Role;

  bannedReason: string | null;
  bannedEndTime: Date | null;
}

export interface UserListData {
  id: string;
  name: string;
  role: Role;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export interface UserUpdateData extends Omit<UserAttributes, 'id'> {}

// View Data

export enum UserStatus {
  ACTIVE = 1,
  BANNED = 100,
}

export interface UserListViewData {
  id: string;
  name: string;
  role: Role;
  email: string;
  status: UserStatus;
}

export interface UserViewData extends UserListViewData {
  bannedReason: string | null;
  bannedEndTime: Date | null;
  bookedPerWeek: number;
  infringementThisTerm: InfringmentData[];
}
