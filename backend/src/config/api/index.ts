import { Router } from 'express';
import auth from './auth';
import bookings from './bookings';
import users from './users';

const routes = Router();

routes.use('/auth', auth);
routes.use('/bookings', bookings);
routes.use('/users', users);

export default routes;
