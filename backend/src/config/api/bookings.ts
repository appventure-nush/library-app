import { Router } from 'express';
import BookingsController from '../../controllers/BookingsController';

const controller = new BookingsController();
const router = Router();

router.get('/', controller.index);
router.post('/', controller.create);

router.get('/:id', controller.show);
router.delete('/:id', controller.delete);

export default router;
