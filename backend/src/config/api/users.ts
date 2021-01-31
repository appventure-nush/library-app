import UsersController from 'controllers/UsersController';
import { Router } from 'express';
import { checkBearerToken } from 'middlewares/checkBearerToken';
import { checkRole } from 'middlewares/checkRole';
import { BearerTokenType } from 'types/tokens';
import { Role } from 'types/User';

import userStats from './userStats';

const controller = new UsersController();

const router = Router();

router.get(
  '/',
  [checkBearerToken(BearerTokenType.AccessToken)],
  [checkRole(Role.LIBRARIAN)],
  controller.index,
);

router.use('/stats', [checkBearerToken(BearerTokenType.AccessToken)], userStats);
router.get('/self', [checkBearerToken(BearerTokenType.AccessToken)], controller.showSelf);

router.patch(
  '/:id/role',
  [checkBearerToken(BearerTokenType.AccessToken)],
  [checkRole(Role.ADMIN)],
  controller.updateRole,
);
router.post(
  '/:id/infringements',
  [checkBearerToken(BearerTokenType.AccessToken)],
  [checkRole(Role.LIBRARIAN)],
  controller.createInfringement,
);
router.post(
  '/:id/ban',
  [checkBearerToken(BearerTokenType.AccessToken)],
  [checkRole(Role.LIBRARIAN)],
  controller.banUser,
);
router.post(
  '/:id/unban',
  [checkBearerToken(BearerTokenType.AccessToken)],
  [checkRole(Role.LIBRARIAN)],
  controller.unbanUser,
);
router.get(
  '/:id',
  [checkBearerToken(BearerTokenType.AccessToken)],
  [checkRole(Role.LIBRARIAN)],
  controller.show,
);
router.put('/:id', controller.update);
router.delete('/:id', [checkRole(Role.LIBRARIAN)], controller.delete);

export default router;
