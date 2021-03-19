import RoomsController from 'controllers/RoomsController';
import { Router } from 'express';
import { checkRole } from 'middlewares/checkRole';
import { Role } from 'types/User';

const controller = new RoomsController();
const router = Router();

router.get('/bookables', controller.index);
router.get('/:id/pin', [checkRole(Role.LIBRARIAN)], controller.showPin);
router.get('/pins', [checkRole(Role.LIBRARIAN)], controller.showPins);

export default router;
