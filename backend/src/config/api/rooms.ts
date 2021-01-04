import { Router } from 'express';
import RoomsController from 'controllers/RoomsController';

const controller = new RoomsController();
const router = Router();

router.get('/bookables', controller.index);

export default router;
