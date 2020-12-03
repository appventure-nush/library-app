import { Router } from 'express';
import { checkBearerToken } from '../../middlewares/checkBearerToken';
import { BearerTokenType } from '../../types/tokens';
import auth from './auth';
import bookings from './bookings';
import users from './users';

const routes = Router();

routes.use('/auth', auth);
routes.use('/bookings', [checkBearerToken(BearerTokenType.AccessToken)], bookings);
routes.use('/users', users);

export default routes;
