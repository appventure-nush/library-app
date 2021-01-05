import AuthController from 'controllers/AuthController';
import { Router } from 'express';

const controller = new AuthController();
const router = Router();

router.post('/token', controller.tokenAuthentication);
router.post('/email', controller.azureAdIdTokenAuthentication);

export default router;
