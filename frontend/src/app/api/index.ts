import * as auth from './auth';
import * as booking from './booking';
import * as room from './room';
import * as users from './users';
import * as week from './week';

const api = {
  auth,
  users,
  booking,
  week,
  room,
};

Object.freeze(api);

export default api;
