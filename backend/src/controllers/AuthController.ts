import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import User from 'models/User';
import { isRefreshTokenSignedPayload } from 'types/tokens';

export default class AuthController {
  // Temporary, to be removed after Office 365 OAuth
  public emailAuthentication(req: Request, res: Response) {
    // Check whether a user has a password. If no password, send passwordless login email
    const email = req.body.email;
    if (!email) {
      res.sendStatus(400);
      return;
    }

    // Find if user exists in the database
    // TODO: WARNING, DOESNT SUPPORT USERS WITH THE SAME NAME
    const name = email.split('@')[0];
    User.findOne<User>({
      where: { name: name },
    })
      .then((user: User | null) =>
        !!user ? res.status(201).json(user.createAuthenticationTokens()) : res.status(404).json(),
      )
      .catch((err: Error) => res.status(500).json(err));
  }

  public tokenAuthentication(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error('No valid input');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      throw new Error('No valid input');
    }

    const payload = verify(token, process.env.JWT_SECRET!);

    if (!isRefreshTokenSignedPayload(payload)) {
      throw new Error('No valid input');
    }
    const { userId } = payload;

    User.findByPk<User>(userId).then((user: User | null) =>
      user ? res.status(201).json(user.createAuthenticationTokens()) : res.sendStatus(404),
    );
  }
}
