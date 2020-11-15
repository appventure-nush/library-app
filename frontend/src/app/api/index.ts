import * as users from './users';
import * as auth from './auth';

const api = {
  auth,
  users,
};

Object.freeze(api);

export default api;
