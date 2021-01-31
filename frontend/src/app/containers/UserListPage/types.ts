import { UserListViewData } from 'types/User';

/* --- STATE --- */
export interface UserListPageState {
  users: UserListViewData[];
}

export type ContainerState = UserListPageState;
