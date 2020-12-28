import { Router } from 'express';
import AuthController from 'controllers/AuthController';

const controller = new AuthController();
const router = Router();

router.post('/token', controller.tokenAuthentication);
// TODO: Temporary route before Office 365 OAuth
router.post('/email', controller.emailAuthentication);

export default router;
