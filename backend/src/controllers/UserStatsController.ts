import { Request, Response } from 'express';
import UserStats from 'models/UserStats';
import { AccessTokenSignedPayload } from 'types/tokens';
import { UserStatsListData } from 'types/UserStats';

export default class UserStatsController {
  public async showSelf(req: Request, res: Response) {
    try {
      const payload = res.locals.payload as AccessTokenSignedPayload;
      const { userId } = payload;

      const stats: UserStats | null = await UserStats.findOne<UserStats>({
        where: { userId: userId },
      });
      if (stats === null) {
        res.sendStatus(404);
      } else {
        const userStatsListData: UserStatsListData = {
          bookedPerWeek: stats.bookedPerWeek,
        };
        res.status(201).json(userStatsListData);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }
}
