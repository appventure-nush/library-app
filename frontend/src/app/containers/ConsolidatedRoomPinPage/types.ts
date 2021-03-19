import { RoomPinData } from 'types/Room';

/* --- STATE --- */
export interface ConsolidatedRoomPinPageState {
  pins: RoomPinData[];
}

export type ContainerState = ConsolidatedRoomPinPageState;
