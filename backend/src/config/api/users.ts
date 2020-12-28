import { Router } from 'express';
import { checkBearerToken } from 'middlewares/checkBearerToken';
import { BearerTokenType } from 'types/tokens';
import UsersController from 'controllers/UsersController';

const controller = new UsersController();
const router = Router();

router.get('/', controller.index);
router.post('/', controller.create);

router.get('/self', [checkBearerToken(BearerTokenType.AccessToken)], controller.showSelf);

router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
