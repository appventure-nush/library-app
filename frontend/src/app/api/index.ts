import * as users from './users';
import * as auth from './auth';
import * as booking from './booking';
import * as week from './week';

const api = {
  auth,
  users,
  booking,
  week,
};

Object.freeze(api);

export default api;
