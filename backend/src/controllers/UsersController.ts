import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import Infringement from 'models/Infringement';
import User from 'models/User';
import UserStats from 'models/UserStats';
import { DestroyOptions, UpdateOptions } from 'sequelize';
import { AccessTokenSignedPayload } from 'types/tokens';
import { Role, UserListViewData, UserStatus, UserUpdateData, UserViewData } from 'types/User';

export default class UsersController {
  public async index(req: Request, res: Response) {
    try {
      const users = await User.findAll<User>({}).then((users: Array<User>) =>
        users.map(async user => {
          const userListViewData: UserListViewData = {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            status: user.bannedEndTime === null ? UserStatus.ACTIVE : UserStatus.BANNED,
          };
          return userListViewData;
        }),
      );
      Promise.all(users)
        .then(users => res.status(201).json(users))
        .catch((err: Error) => {
          throw err;
        });
    } catch (err) {
      res.sendStatus(500);
    }
  }

  public async show(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    try {
      const currentUser = await User.findByPk<User>(userId);
      const targetUserId: string = req.params.id;
      if (currentUser.role < Role.LIBRARIAN && currentUser.id !== targetUserId) {
        res.sendStatus(401);
        return;
      }
      const targetUser = await User.findByPk<User>(targetUserId);
      const targetUserStats = await UserStats.findOne({ where: { userId: targetUserId } });
      const targetUserInfringements = await Infringement.findAll({
        where: { userId: targetUserId },
      });
      const userViewData: UserViewData = {
        id: targetUser.id,
        name: targetUser.name,
        role: targetUser.role,
        email: targetUser.email,
        status: targetUser.bannedEndTime === null ? UserStatus.ACTIVE : UserStatus.BANNED,
        bannedReason: targetUser.bannedReason,
        bannedEndTime: targetUser.bannedEndTime,
        bookedPerWeek: targetUserStats.bookedPerWeek,
        infringementThisTerm: targetUserInfringements.map(infringement => {
          return {
            details: infringement.details,
            createdAt: infringement.createdAt,
          };
        }),
      };
      res.status(201).json(userViewData);
    } catch (err) {
      res.sendStatus(500);
    }
  }

  public showSelf(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;

    User.findByPk<User>(userId).then((user: User | null) =>
      user ? res.json(user) : res.status(404).json({ errors: ['User not found'] }),
    );
  }

  public update(req: Request, res: Response) {
    const userId: number = Number(req.params.id);
    const params: UserUpdateData = req.body;

    const update: UpdateOptions = {
      where: { id: userId },
      limit: 1,
    };

    User.update(params, update)
      .then(() => res.status(202).json({ data: 'success' }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public async updateRole(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    try {
      const currentUser = await User.findByPk<User>(userId);
      const targetUserId = req.params.id;
      const params: UserUpdateData = req.body;
      if (currentUser.role !== Role.ADMIN) {
        res.sendStatus(401);
        return;
      }
      await User.update(params, {
        where: { id: targetUserId },
        limit: 1,
      });
      res.sendStatus(202);
    } catch (err) {
      console.log(err.message);
      res.sendStatus(500);
    }
  }

  public async createInfringement(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    try {
      const currentUser = await User.findByPk<User>(userId);
      const targetUserId = req.params.id;
      const details: string = req.body.details;
      if (currentUser.role < Role.LIBRARIAN) {
        res.sendStatus(401);
        return;
      }
      await Infringement.create({
        userId: targetUserId,
        details: details,
      });
      res.sendStatus(201);
    } catch (err) {
      console.log(err.message);
      res.sendStatus(500);
    }
  }

  public async banUser(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    try {
      const currentUser = await User.findByPk<User>(userId);
      const targetUserId = req.params.id;
      const details: string = req.body.details;
      if (currentUser.role < Role.LIBRARIAN) {
        res.sendStatus(401);
        return;
      }
      await User.update(
        {
          bannedEndTime: DateTime.local().endOf('days').plus({ months: 1 }).toJSDate(),
          bannedReason: details,
        },
        { where: { id: targetUserId } },
      );
      res.sendStatus(201);
    } catch (err) {
      console.log(err.message);
      res.sendStatus(500);
    }
  }

  public async unbanUser(req: Request, res: Response) {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    try {
      const currentUser = await User.findByPk<User>(userId);
      const targetUserId = req.params.id;
      if (currentUser.role < Role.LIBRARIAN) {
        res.sendStatus(401);
        return;
      }
      await User.update(
        {
          bannedEndTime: null,
          bannedReason: null,
        },
        { where: { id: targetUserId } },
      );
      res.sendStatus(201);
    } catch (err) {
      console.log(err.message);
      res.sendStatus(500);
    }
  }

  public delete(req: Request, res: Response) {
    const userId: number = Number(req.params.id);
    const deleteOptions: DestroyOptions = {
      where: { id: userId },
      limit: 1,
    };

    User.destroy(deleteOptions)
      .then(() => res.status(202).json({ data: 'success' }))
      .catch((err: Error) => res.status(500).json(err));
  }
}
