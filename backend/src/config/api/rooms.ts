import RoomsController from 'controllers/RoomsController';
import { Router } from 'express';

const controller = new RoomsController();
const router = Router();

router.get('/bookables', controller.index);

export default router;
