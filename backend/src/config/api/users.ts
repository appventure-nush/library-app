import UsersController from 'controllers/UsersController';
import { Router } from 'express';
import { checkBearerToken } from 'middlewares/checkBearerToken';
import { checkRole } from 'middlewares/checkRole';
import { BearerTokenType } from 'types/tokens';
import { Role } from 'types/User';

import userStats from './userStats';

const controller = new UsersController();

const router = Router();

router.get('/', [checkRole(Role.LIBRARIAN)], controller.index);

router.use('/stats', [checkBearerToken(BearerTokenType.AccessToken)], userStats);
router.get('/self', [checkBearerToken(BearerTokenType.AccessToken)], controller.showSelf);

// TODO: Ensure that this action is done by self/librarian/admin
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', [checkRole(Role.LIBRARIAN)], controller.delete);

export default router;
