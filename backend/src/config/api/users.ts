import { Router } from 'express';
import { checkBearerToken } from 'middlewares/checkBearerToken';
import { BearerTokenType } from 'types/tokens';
import UsersController from 'controllers/UsersController';
import { Role } from 'types/User';
import { checkRole } from 'middlewares/checkRole';

const controller = new UsersController();
const router = Router();

router.get('/', [checkRole(Role.LIBRARIAN)], controller.index);

router.get('/self', [checkBearerToken(BearerTokenType.AccessToken)], controller.showSelf);

// TODO: Ensure that this action is done by self/librarian/admin
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', [checkRole(Role.LIBRARIAN)], controller.delete);

export default router;
