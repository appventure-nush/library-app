import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { BookingListViewData } from './Booking';
import { InfringmentData } from './Infringement';

export enum UserStatus {
  ACTIVE = 1,
  BANNED = 100,
}

export const UserStatusString: Record<UserStatus, String> = {
  1: 'Active',
  100: 'Banned',
};

export const UserStatusBadge: Record<UserStatus, PresetStatusColorType> = {
  1: 'success',
  100: 'warning',
};

export enum Role {
  STUDENT = 1,
  STAFF = 11,
  LIBRARIAN = 12,
  ADMIN = 100,
}

export const roleString: Record<Role, string> = {
  1: 'Student',
  11: 'Staff',
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
  id: string;
  name: string;
  role: Role;
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
  bannedEndTime: string | null;
  bookedPerWeek: number;
  infringementThisTerm: InfringmentData[];
  bookings: BookingListViewData[];
}

export interface UserStatsListData {
  bookedPerWeek: number;
}

export interface UserData extends UserListData {
  bannedReason: string | null;
  bannedEndTime: string | null;
}
