import { Router } from 'express';
import WeeksController from 'controllers/WeeksController';

const controller = new WeeksController();
const router = Router();

router.get('/current', controller.showCurrent);

export default router;
