import UserStatsController from 'controllers/UserStatsController';
import { Router } from 'express';

const controller = new UserStatsController();

const router = Router();

router.get('/self', controller.showSelf);

export default router;
