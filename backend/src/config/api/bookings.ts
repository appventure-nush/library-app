import BookingsController from 'controllers/BookingsController';
import { Router } from 'express';
import { checkRole } from 'middlewares/checkRole';
import { Role } from 'types/User';

const controller = new BookingsController();
const router = Router();

router.get('/', [checkRole(Role.LIBRARIAN)], controller.index);
router.post('/', controller.create);

router.get('/self', controller.indexSelf);
router.get('/upcoming', controller.indexUpcoming);

router.patch('/:id/cancel', controller.cancel);
router.post('/:id/checkin', controller.checkIn);
router.post('/:id/checkout', controller.checkOut);
router.patch('/:id/status', [checkRole(Role.LIBRARIAN)], controller.updateStatus);
router.get('/:id', controller.show);
router.delete('/:id', [checkRole(Role.LIBRARIAN)], controller.delete);

export default router;
