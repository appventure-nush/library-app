import { Request, Response } from 'express';
import User from 'models/User';
import { UserCreationAttributes, UserUpdateData } from 'types/User';
import { UpdateOptions, DestroyOptions } from 'sequelize';
import { AccessTokenSignedPayload } from 'types/tokens';

export default class UsersController {
  public index(req: Request, res: Response) {
    User.findAll<User>({})
      .then((users: Array<User>) => res.json(users))
      .catch((err: Error) => res.status(500).json(err));
  }

  public show(req: Request, res: Response) {
    const userId: number = Number(req.params.id);

    User.findByPk<User>(userId).then((user: User | null) =>
      user ? res.json(user) : res.status(404).json({ errors: ['User not found'] }),
    );
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
