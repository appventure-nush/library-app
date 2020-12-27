import { Router } from 'express';
import { checkRole } from '../../middlewares/checkRole';
import { Role } from '../../types/User';
import BookingsController from '../../controllers/BookingsController';

const controller = new BookingsController();
const router = Router();

router.get('/', [checkRole(Role.LIBRARIAN)], controller.index);
router.post('/', controller.create);

router.get('/self', controller.indexSelf);

router.get('/:id', [checkRole(Role.LIBRARIAN)], controller.show);
router.delete('/:id', [checkRole(Role.LIBRARIAN)], controller.delete);

export default router;
