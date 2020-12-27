import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { Role } from '../types/User';
import { AccessTokenSignedPayload } from '../types/tokens';

export const checkRole = (role: Role) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = res.locals.payload as AccessTokenSignedPayload;
    const { userId } = payload;
    User.findByPk<User>(userId).then((user: User | null) =>
      !!user && user.role >= role ? next() : res.sendStatus(401),
    );
  } catch (error) {
    res.sendStatus(401);
    return;
  }
};
