import { Router } from 'express';
import { checkBearerToken } from '../../middlewares/checkBearerToken';
import { BearerTokenType } from '../../types/tokens';
import BookingsController from '../../controllers/BookingsController';

const controller = new BookingsController();
const router = Router();

router.get('/', controller.index);
router.post('/', [checkBearerToken(BearerTokenType.AccessToken)], controller.create);

router.get('/:id', controller.show);
router.delete('/:id', controller.delete);

export default router;
