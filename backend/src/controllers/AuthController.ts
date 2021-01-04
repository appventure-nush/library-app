import { Request, Response } from 'express';
import { verify as azureVerify, VerifyOptions } from 'azure-ad-verify-token';
import { verify as jsonVerify } from 'jsonwebtoken';
import User from 'models/User';
import { isRefreshTokenSignedPayload } from 'types/tokens';

export default class AuthController {
  public async azureAdIdTokenAuthentication(req: Request, res: Response) {
    const { azureAdIdToken } = req.body;
    if (!azureAdIdToken) {
      res.sendStatus(400);
      return;
    }

    const options: VerifyOptions = {
      jwksUri: 'https://login.microsoftonline.com/common/discovery/keys',
      issuer: 'https://login.microsoftonline.com/d72a7172-d5f8-4889-9a85-d7424751592a/v2.0',
      audience: 'b2c54a7a-5231-4de6-b3b1-c603abbaed00',
    };

    azureVerify(azureAdIdToken, options)
      .then((decoded: any) => {
        // verified and decoded token
        User.findOrCreate<User>({
          where: {
            azureOid: decoded.oid,
          },
          defaults: {
            name: decoded.name,
            email: decoded.preferred_username,
            azureOid: decoded.oid,
            role: 1,
          },
        })
          .then(([user, isNew]) => res.status(201).json(user.createAuthenticationTokens()))
          .catch(err => res.status(500).json(err));
      })
      .catch(error => {
        // invalid token
        res.sendStatus(401);
      });
  }

  public tokenAuthentication(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    try {
      if (!authorization) {
        throw new Error('No valid input');
      }

      const [type, token] = authorization.split(' ');

      if (type !== 'Bearer') {
        throw new Error('No valid input');
      }

      const payload = jsonVerify(token, process.env.JWT_SECRET!);

      if (!isRefreshTokenSignedPayload(payload)) {
        throw new Error('No valid input');
      }
      const { userId } = payload;

      User.findByPk<User>(userId).then((user: User | null) =>
        user ? res.status(201).json(user.createAuthenticationTokens()) : res.sendStatus(404),
      );
    } catch (err) {
      res.sendStatus(500);
    }
  }
}
