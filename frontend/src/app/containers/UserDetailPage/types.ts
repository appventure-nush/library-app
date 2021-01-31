import { UserViewData } from 'types/User';

/* --- STATE --- */
export interface UserDetailPageState {
  user: UserViewData | null;
}

export type ContainerState = UserDetailPageState;
