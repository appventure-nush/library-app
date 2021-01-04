import * as users from './users';
import * as auth from './auth';
import * as booking from './booking';
import * as week from './week';
import * as room from './room';

const api = {
  auth,
  users,
  booking,
  week,
  room,
};

Object.freeze(api);

export default api;
