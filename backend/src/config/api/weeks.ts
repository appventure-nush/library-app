import WeeksController from 'controllers/WeeksController';
import { Router } from 'express';

const controller = new WeeksController();
const router = Router();

router.get('/current', controller.showCurrent);

export default router;
