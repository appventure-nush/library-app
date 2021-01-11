import { Request, Response } from 'express';
import Room from 'models/Room';
import { RoomListData } from 'types/Room';

export default class RoomsController {
  public index(req: Request, res: Response) {
    Room.findAll<Room>({})
      .then((rooms: Array<Room>) =>
        res.json(
          rooms.map(room => {
            const roomListData: RoomListData = {
              id: room.id,
              name: room.name,
            };
            return roomListData;
          }),
        ),
      )
      .catch((err: Error) => res.status(500).json(err));
  }

  public async showPin(req: Request, res: Response) {
    try {
      const roomId: number = Number(req.params.id);
      const room = await Room.findByPk<Room>(roomId);
      if (room === null) {
        throw new Error('Room not found');
      }
      res.status(201).json(room.checkInPin);
    } catch (err) {
      res.sendStatus(500);
    }
  }
}
