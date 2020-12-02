import * as users from './users';
import * as auth from './auth';
import * as booking from './booking';

const api = {
  auth,
  users,
  booking,
};

Object.freeze(api);

export default api;
