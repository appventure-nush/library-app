import { Router } from 'express';
import { checkBearerToken } from 'middlewares/checkBearerToken';
import { BearerTokenType } from 'types/tokens';
import auth from './auth';
import bookings from './bookings';
import weeks from './weeks';
import users from './users';
import rooms from './rooms';

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', users);
routes.use('/bookings', [checkBearerToken(BearerTokenType.AccessToken)], bookings);
routes.use('/weeks', [checkBearerToken(BearerTokenType.AccessToken)], weeks);
routes.use('/rooms', [checkBearerToken(BearerTokenType.AccessToken)], rooms);

export default routes;
