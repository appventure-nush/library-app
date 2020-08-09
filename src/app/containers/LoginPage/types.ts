import { User } from 'types/User';

export enum LoginErrorType {
  RESPONSE_ERROR = 1,
  USER_NOT_FOUND = 2,
}

export interface LoginState {
  user: User | null;
  loading: boolean;
  error?: LoginErrorType | null;
}

export type ContainerState = LoginState;
