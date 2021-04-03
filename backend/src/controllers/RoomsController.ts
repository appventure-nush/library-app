import database from 'config/database';
import { Request, Response } from 'express';
import Room from 'models/Room';
import User from 'models/User';
import { generatePinSync } from 'secure-pin';
import { RoomCreateData, RoomListData, RoomPinData } from 'types/Room';
import { AccessTokenSignedPayload } from 'types/tokens';
import { Role } from 'types/User';

export default class RoomsController {
  public async index(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    try {
      const currentUser = await User.findByPk<User>(userId);
      var rooms = await Room.findAll<Room>({}).catch((err: Error) => {
        throw err;
      });
      if (currentUser.role < Role.STAFF) rooms = rooms.filter(room => !room.staffOnly);
      res.json(
        rooms.map(room => {
          const roomListData: RoomListData = {
            id: room.id,
            name: room.name,
          };
          return roomListData;
        }),
      );
    } catch (err) {
      res.status(500).json(err);
    }
  }

  public async create(req: Request, res: Response) {
    const params: RoomCreateData = req.body;
    const t = await database.transaction();
    try {
      Room.create<Room>(
        {
          name: params.name,
          staffOnly: params.staffOnly,
          checkInPin: generatePinSync(6),
        },
        { transaction: t },
      );
      await t.commit();
    } catch (err) {
      await t.rollback();
      res.status(500).json(err);
    }
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

  public async showPins(req: Request, res: Response) {
    try {
      const rooms = await Room.findAll<Room>();
      res.status(201).json(
        rooms.map(room => {
          const roomPinData: RoomPinData = {
            name: room.name,
            checkInPin: room.checkInPin,
          };
          return roomPinData;
        }),
      );
    } catch (err) {
      res.sendStatus(500);
    }
  }
}
